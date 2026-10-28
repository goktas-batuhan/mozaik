import { fireEvent, render, screen } from '@testing-library/react'
import { CtaMarqueeBand } from './cta-marquee-band'

describe('CtaMarqueeBand', () => {
  it('reads the phrases once for screen readers', () => {
    render(<CtaMarqueeBand phrases={['Design that ships', 'Motion']} actionLabel="Talk" disabled />)
    expect(screen.getByText('Design that ships. Motion', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('repeats the phrases visually inside an aria-hidden band', () => {
    render(<CtaMarqueeBand phrases={['Design that ships']} actionLabel="Talk" disabled />)
    const visual = screen.getAllByText('Design that ships', { selector: 'span.flex' })
    expect(visual.length).toBeGreaterThan(1)
    expect(visual[0].closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('renders a link when actionHref is set', () => {
    render(<CtaMarqueeBand phrases={['A']} actionLabel="Talk" actionHref="/talk" title="Start" disabled />)
    expect(screen.getByRole('link', { name: 'Talk' })).toHaveAttribute('href', '/talk')
    expect(screen.getByRole('heading', { level: 2, name: 'Start' })).toBeInTheDocument()
  })

  it('renders a button that fires onAction otherwise', () => {
    const onAction = vi.fn()
    render(<CtaMarqueeBand phrases={['A']} actionLabel="Talk" onAction={onAction} disabled />)
    fireEvent.click(screen.getByRole('button', { name: 'Talk' }))
    expect(onAction).toHaveBeenCalledOnce()
  })
})
