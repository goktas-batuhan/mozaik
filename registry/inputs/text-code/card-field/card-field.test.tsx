import { fireEvent, render, screen } from '@testing-library/react'
import { CardField } from './card-field'

const numberInput = () => screen.getByLabelText('Card') as HTMLInputElement
const nextYear = () => String((new Date().getFullYear() + 2) % 100).padStart(2, '0')

describe('CardField', () => {
  it('groups digits the way the brand prints them and names the brand', () => {
    render(<CardField />)
    fireEvent.change(numberInput(), { target: { value: '378282246' } })
    expect(numberInput()).toHaveValue('3782 82246')
    expect(screen.getByText('American Express')).toBeInTheDocument()
  })

  it('flags a number that fails the Luhn check', async () => {
    render(<CardField />)
    fireEvent.change(numberInput(), { target: { value: '4242424242424241' } })
    expect(await screen.findByText("That card number doesn't look right")).toBeInTheDocument()
    expect(numberInput()).toHaveAttribute('aria-invalid', 'true')
  })

  it('reveals expiry and security code once the number is valid', async () => {
    render(<CardField />)
    expect(screen.queryByLabelText('Security code')).not.toBeInTheDocument()
    fireEvent.change(numberInput(), { target: { value: '4242424242424242' } })
    expect(await screen.findByLabelText('Security code')).toBeInTheDocument()
    expect(screen.getByLabelText('Expiry, month and year')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit card number ending 4242' })).toBeInTheDocument()
  })

  it('rejects an expired card and keeps Pay disabled until everything is valid', async () => {
    render(<CardField amount={10} />)
    fireEvent.change(numberInput(), { target: { value: '4242424242424242' } })
    fireEvent.change(await screen.findByLabelText('Expiry, month and year'), { target: { value: '0120' } })
    expect(await screen.findByText('This card has expired')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pay $10.00' })).toHaveAttribute('aria-disabled', 'true')
  })

  it('charges the card with its details once complete', async () => {
    const onPay = vi.fn().mockResolvedValue(undefined)
    render(<CardField amount={48} onPay={onPay} />)
    fireEvent.change(numberInput(), { target: { value: '4242424242424242' } })
    fireEvent.change(await screen.findByLabelText('Expiry, month and year'), { target: { value: `12${nextYear()}` } })
    fireEvent.change(screen.getByLabelText('Security code'), { target: { value: '123' } })
    const pay = screen.getByRole('button', { name: 'Pay $48.00' })
    expect(pay).toHaveAttribute('aria-disabled', 'false')
    fireEvent.click(pay)
    expect(onPay).toHaveBeenCalledWith({ brand: 'visa', last4: '4242', expiry: `12/${nextYear()}` })
    expect(await screen.findByRole('button', { name: 'Paid $48.00' })).toBeInTheDocument()
  })
})
