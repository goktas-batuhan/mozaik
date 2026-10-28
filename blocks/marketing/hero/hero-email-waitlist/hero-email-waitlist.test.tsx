import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { HeroEmailWaitlist } from './hero-email-waitlist'

const fill = (value: string) => fireEvent.change(screen.getByLabelText('Email address'), { target: { value } })

describe('HeroEmailWaitlist', () => {
  it('rejects an invalid email without calling onSubmit', () => {
    const onSubmit = vi.fn()
    render(<HeroEmailWaitlist title="T" onSubmit={onSubmit} disabled />)
    fill('nope')
    fireEvent.click(screen.getByRole('button', { name: 'Join the waitlist' }))
    expect(screen.getByRole('alert')).toHaveTextContent('valid email')
    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a trimmed valid email and shows the success message', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<HeroEmailWaitlist title="T" onSubmit={onSubmit} successMessage="Thanks!" disabled />)
    fill('  me@example.com ')
    fireEvent.click(screen.getByRole('button', { name: 'Join the waitlist' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Thanks!'))
    expect(onSubmit).toHaveBeenCalledWith('me@example.com')
  })

  it('shows an error and keeps the form when onSubmit rejects', async () => {
    render(<HeroEmailWaitlist title="T" onSubmit={() => Promise.reject(new Error('x'))} disabled />)
    fill('me@example.com')
    fireEvent.click(screen.getByRole('button', { name: 'Join the waitlist' }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong'))
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
  })

  it('renders the headline, eyebrow and footnote', () => {
    render(<HeroEmailWaitlist title="Calm inbox" eyebrow="Early" footnote="2,400 waiting" disabled />)
    expect(screen.getByRole('heading', { level: 1, name: 'Calm inbox' })).toBeInTheDocument()
    expect(screen.getByText('Early')).toBeInTheDocument()
    expect(screen.getByText('2,400 waiting')).toBeInTheDocument()
  })
})
