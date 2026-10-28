import { fireEvent, render, screen } from '@testing-library/react'
import { HeroStoreBadges } from './hero-store-badges'

describe('HeroStoreBadges', () => {
  it('renders both headline lines inside one h1', () => {
    render(<HeroStoreBadges title={['Share what matters,', "inspire what's real"]} />)
    const h = screen.getByRole('heading', { level: 1 })
    expect(h).toHaveTextContent('Share what matters,')
    expect(h).toHaveTextContent("inspire what's real")
  })

  it('renders links for stores with href and buttons otherwise', () => {
    const onClick = vi.fn()
    render(
      <HeroStoreBadges
        title={['A', 'B']}
        stores={[{ name: 'App Store', href: '/ios' }, { name: 'Play Store', onClick }]}
      />,
    )
    expect(screen.getByRole('link', { name: /App Store/ })).toHaveAttribute('href', '/ios')
    fireEvent.click(screen.getByRole('button', { name: /Play Store/ }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('shows the social proof label and hides the avatar stack from assistive tech', () => {
    render(<HeroStoreBadges title={['A', 'B']} socialProof={{ label: '12,000 people', people: ['AK', 'MJ'] }} />)
    expect(screen.getByText('12,000 people')).toBeInTheDocument()
    expect(screen.getByText('AK').parentElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('starts fully visible when disabled', () => {
    render(<HeroStoreBadges title={['A', 'B']} disabled />)
    expect(screen.getByRole('heading', { level: 1 }).style.opacity).not.toBe('0')
  })
})
