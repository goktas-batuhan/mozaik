import { fireEvent, render, screen } from '@testing-library/react'
import { FloatInput } from './float-input'

describe('FloatInput', () => {
  it('names the input by its label', () => {
    render(<FloatInput label="Email" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'text')
  })

  it('hides the placeholder until the label floats on focus', () => {
    render(<FloatInput label="Email" placeholder="you@example.com" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('placeholder', '')
    fireEvent.focus(input)
    expect(input).toHaveAttribute('placeholder', 'you@example.com')
    fireEvent.blur(input)
    expect(input).toHaveAttribute('placeholder', '')
  })

  it('works uncontrolled and reports changes', () => {
    const onChange = vi.fn()
    render(<FloatInput label="Name" defaultValue="Ada" onChange={onChange} />)
    const input = screen.getByLabelText('Name')
    expect(input).toHaveValue('Ada')
    fireEvent.change(input, { target: { value: 'Grace' } })
    expect(input).toHaveValue('Grace')
    expect(onChange).toHaveBeenCalledWith('Grace')
  })

  it('follows the value prop when controlled', () => {
    const { rerender } = render(<FloatInput label="Name" value="one" />)
    const input = screen.getByLabelText('Name')
    fireEvent.change(input, { target: { value: 'two' } })
    expect(input).toHaveValue('one')
    rerender(<FloatInput label="Name" value="three" />)
    expect(input).toHaveValue('three')
  })

  it('can be disabled', () => {
    render(<FloatInput label="Name" disabled />)
    expect(screen.getByLabelText('Name')).toBeDisabled()
  })
})
