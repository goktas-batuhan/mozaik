import { fireEvent, render, screen } from '@testing-library/react'
import { HeroAuroraCenter } from './hero-aurora-center'

describe('HeroAuroraCenter', () => {
  it('renders the headline and copy', () => {
    render(<HeroAuroraCenter title="Morning light" description="Quiet software" disabled />)
    expect(screen.getByRole('heading', { level: 1, name: 'Morning light' })).toBeInTheDocument()
    expect(screen.getByText('Quiet software')).toBeInTheDocument()
  })

  it('lists the highlights', () => {
    render(<HeroAuroraCenter title="T" disabled highlights={[{ title: 'Fast', text: 'Quick pages' }, { title: 'Private', text: 'Your data' }]} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Quick pages')).toBeInTheDocument()
  })

  it('renders links and buttons for the actions', () => {
    const onClick = vi.fn()
    render(<HeroAuroraCenter title="T" disabled primaryAction={{ label: 'Go', href: '/go' }} secondaryAction={{ label: 'Demo', onClick }} />)
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/go')
    fireEvent.click(screen.getByRole('button', { name: 'Demo' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not hide the headline behind the entrance animation when disabled', () => {
    render(<HeroAuroraCenter title="Visible" disabled />)
    expect(screen.getByRole('heading', { level: 1 }).style.opacity).not.toBe('0')
  })
})
