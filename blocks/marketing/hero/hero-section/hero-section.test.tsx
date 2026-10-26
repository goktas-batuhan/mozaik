import { fireEvent, render, screen } from '@testing-library/react'
import { HeroSection } from './hero-section'

describe('HeroSection', () => {
  it('labels the section with its headline', () => {
    render(<HeroSection title="Ship faster" description="Copy" eyebrow="New" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Ship faster' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Ship faster' })).toBeInTheDocument()
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders links for actions with href and buttons otherwise', () => {
    const onClick = vi.fn()
    render(
      <HeroSection
        title="Hero"
        primaryAction={{ label: 'Start', href: '/start' }}
        secondaryAction={{ label: 'Demo', onClick }}
      />,
    )
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/start')
    fireEvent.click(screen.getByRole('button', { name: 'Demo' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('cycles the rotating words after the headline', () => {
    render(<HeroSection title="Components that" rotatingWords={['fit together', 'move']} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Components that/)
    expect(screen.getAllByText(/fit together/).length).toBeGreaterThan(0)
  })

  it('renders the media slot and the requested heading level', () => {
    render(<HeroSection title="Hero" titleAs="h2" media={<img alt="Preview" />} align="left" />)
    expect(screen.getByRole('heading', { level: 2, name: 'Hero' })).toBeInTheDocument()
    expect(screen.getByAltText('Preview')).toBeInTheDocument()
  })

  it('starts fully visible when disabled', () => {
    render(<HeroSection title="Static" disabled />)
    const wrapper = screen.getByRole('heading', { name: 'Static' }).parentElement!
    expect(wrapper.style.opacity).not.toBe('0')
  })
})
