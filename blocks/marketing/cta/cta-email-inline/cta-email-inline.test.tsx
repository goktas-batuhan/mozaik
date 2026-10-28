import { fireEvent, render, screen } from '@testing-library/react'
import { CtaEmailInline } from './cta-email-inline'

const fill = (v: string) => fireEvent.change(screen.getByLabelText('Email address'), { target: { value: v } })

describe('CtaEmailInline', () => {
  it('renders the headline, description and footnote', () => {
    render(<CtaEmailInline title="Weekly letter" description="Short and good" footnote="No spam" disabled />)
    expect(screen.getByRole('heading', { level: 2, name: 'Weekly letter' })).toBeInTheDocument()
    expect(screen.getByText('Short and good')).toBeInTheDocument()
    expect(screen.getByText('No spam')).toBeInTheDocument()
  })

  it('flags an invalid email and does not call onSubmit', () => {
    const onSubmit = vi.fn()
    render(<CtaEmailInline title="T" onSubmit={onSubmit} disabled />)
    fill('not-an-email')
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a trimmed email and swaps the form for the success message', () => {
    const onSubmit = vi.fn()
    render(<CtaEmailInline title="T" onSubmit={onSubmit} successMessage="All set" disabled />)
    fill(' me@example.com ')
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    expect(onSubmit).toHaveBeenCalledWith('me@example.com')
    expect(screen.getByRole('status')).toHaveTextContent('All set')
    expect(screen.queryByLabelText('Email address')).not.toBeInTheDocument()
  })

  it('clears an earlier error after a valid submit', () => {
    render(<CtaEmailInline title="T" disabled />)
    fill('bad')
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    fill('ok@example.com')
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
