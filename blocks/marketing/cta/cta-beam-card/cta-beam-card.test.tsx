import { fireEvent, render, screen } from '@testing-library/react'
import { CtaBeamCard } from './cta-beam-card'

describe('CtaBeamCard', () => {
  it('renders the headline, description and note', () => {
    render(<CtaBeamCard title="Launch" description="This afternoon" note="14 days" actionLabel="Go" disabled />)
    expect(screen.getByRole('heading', { level: 2, name: 'Launch' })).toBeInTheDocument()
    expect(screen.getByText('This afternoon')).toBeInTheDocument()
    expect(screen.getByText('14 days')).toBeInTheDocument()
  })

  it('lists the perks', () => {
    render(<CtaBeamCard title="T" perks={['No card', 'Cancel any time']} actionLabel="Go" disabled />)
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['No card', 'Cancel any time'])
  })

  it('renders a link when actionHref is set and a button otherwise', () => {
    const onAction = vi.fn()
    const { rerender } = render(<CtaBeamCard title="T" actionLabel="Go" actionHref="/go" disabled />)
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/go')
    rerender(<CtaBeamCard title="T" actionLabel="Go" onAction={onAction} disabled />)
    fireEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('keeps the traveling light out of the accessibility tree', () => {
    const { container } = render(<CtaBeamCard title="T" actionLabel="Go" />)
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
    expect(screen.queryAllByRole('img')).toHaveLength(0)
  })
})
