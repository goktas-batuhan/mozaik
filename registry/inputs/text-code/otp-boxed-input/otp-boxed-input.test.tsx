import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import { OtpBoxedInput } from './otp-boxed-input'

const box = (n: number, length = 6) => screen.getByLabelText(`Digit ${n} of ${length}`) as HTMLInputElement

describe('OtpBoxedInput', () => {
  it('renders one labelled box per digit', () => {
    render(<OtpBoxedInput length={4} />)
    expect(screen.getAllByRole('textbox')).toHaveLength(4)
    expect(box(1, 4)).toHaveAttribute('autocomplete', 'one-time-code')
  })

  it('types a digit, moves focus on and ignores letters in numeric mode', () => {
    const onChange = vi.fn()
    render(<OtpBoxedInput onChange={onChange} />)
    fireEvent.change(box(1), { target: { value: '7' } })
    expect(onChange).toHaveBeenLastCalledWith('7')
    expect(box(1)).toHaveValue('7')
    expect(box(2)).toHaveFocus()
    fireEvent.change(box(2), { target: { value: 'x' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(box(2)).toHaveValue('')
  })

  it('fills the boxes from a paste and calls onComplete once', () => {
    const onComplete = vi.fn()
    render(<OtpBoxedInput onComplete={onComplete} />)
    const input = box(1)
    const paste = createEvent.paste(input, { clipboardData: { getData: () => '12-34 56' } })
    fireEvent(input, paste)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith('123456')
    expect(box(6)).toHaveValue('6')
  })

  it('backspace on an empty box clears the previous one', () => {
    render(<OtpBoxedInput defaultValue="12" />)
    fireEvent.keyDown(box(3), { key: 'Backspace' })
    expect(box(2)).toHaveValue('')
    expect(box(1)).toHaveValue('1')
    expect(box(2)).toHaveFocus()
  })

  it('shows the value from props when controlled and flags errors', () => {
    const { rerender } = render(<OtpBoxedInput value="98" errorMessage="Nope" />)
    expect(box(1)).toHaveValue('9')
    fireEvent.change(box(3), { target: { value: '1' } })
    expect(box(3)).toHaveValue('')
    rerender(<OtpBoxedInput value="98" error errorMessage="Nope" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Nope')
  })

  it('offers resend once the cooldown is over', () => {
    const onResend = vi.fn()
    render(<OtpBoxedInput resendCooldown={0} onResend={onResend} />)
    fireEvent.click(screen.getByRole('button', { name: 'Resend code' }))
    expect(onResend).toHaveBeenCalledTimes(1)
  })
})
