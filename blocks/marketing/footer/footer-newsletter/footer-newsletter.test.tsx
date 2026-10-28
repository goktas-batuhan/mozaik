import { fireEvent, render, screen } from '@testing-library/react'
import { FooterNewsletter } from './footer-newsletter'

describe('FooterNewsletter', () => {
  it('rejects an invalid address and marks the field invalid', () => {
    const onSubscribe = vi.fn()
    render(<FooterNewsletter brand="Acme" onSubscribe={onSubscribe} />)
    const input = screen.getByLabelText('Email address')
    fireEvent.change(input, { target: { value: 'nope' } })
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    expect(screen.getByRole('alert')).toHaveTextContent('valid email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(onSubscribe).not.toHaveBeenCalled()
  })

  it('hands a trimmed valid address to onSubscribe and shows the success message', () => {
    const onSubscribe = vi.fn()
    render(<FooterNewsletter brand="Acme" onSubscribe={onSubscribe} successMessage="Welcome aboard" />)
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: '  me@example.com ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    expect(onSubscribe).toHaveBeenCalledWith('me@example.com')
    expect(screen.getByRole('status')).toHaveTextContent('Welcome aboard')
    expect(screen.queryByLabelText('Email address')).toBeNull()
  })

  it('clears the error after a good submit', () => {
    render(<FooterNewsletter brand="Acme" />)
    const input = screen.getByLabelText('Email address')
    fireEvent.change(input, { target: { value: 'bad' } })
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    fireEvent.change(input, { target: { value: 'ok@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('renders link columns inside a labelled nav', () => {
    render(<FooterNewsletter brand="Acme" columns={[{ title: 'Company', links: [{ label: 'About', href: '/about' }] }]} />)
    expect(screen.getByRole('navigation', { name: 'Footer' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
  })
})
