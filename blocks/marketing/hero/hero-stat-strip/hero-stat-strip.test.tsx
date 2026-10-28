import { fireEvent, render, screen } from '@testing-library/react'
import { HeroStatStrip } from './hero-stat-strip'

const stats = [
  { value: 120, suffix: '+', label: 'Components' },
  { value: 99.5, suffix: '%', label: 'Uptime', decimalPlaces: 1 },
]

describe('HeroStatStrip', () => {
  it('renders the headline and eyebrow', () => {
    render(<HeroStatStrip title="Quiet library" eyebrow="Since 2023" stats={stats} disabled />)
    expect(screen.getByRole('heading', { level: 1, name: 'Quiet library' })).toBeInTheDocument()
    expect(screen.getByText('Since 2023')).toBeInTheDocument()
  })

  it('pairs every label with its final figure for assistive tech', () => {
    render(<HeroStatStrip title="T" stats={stats} disabled />)
    expect(screen.getAllByText('120').length).toBeGreaterThan(0)
    expect(screen.getAllByText('99.5').length).toBeGreaterThan(0)
    expect(screen.getByText('Components').tagName).toBe('DT')
  })

  it('keeps prefix and suffix around the number', () => {
    render(<HeroStatStrip title="T" stats={[{ value: 5, prefix: '$', suffix: 'M', label: 'Raised' }]} disabled />)
    const text = screen.getByText('Raised').nextElementSibling!.textContent!
    expect(text.startsWith('$')).toBe(true)
    expect(text.endsWith('M')).toBe(true)
  })

  it('renders the call to action as a button when it has no href', () => {
    const onAction = vi.fn()
    render(<HeroStatStrip title="T" stats={stats} actionLabel="Go" onAction={onAction} disabled />)
    fireEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onAction).toHaveBeenCalledOnce()
  })
})
