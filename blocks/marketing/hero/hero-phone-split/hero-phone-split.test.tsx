import { fireEvent, render, screen } from '@testing-library/react'
import { HeroPhoneSplit } from './hero-phone-split'

describe('HeroPhoneSplit', () => {
  it('renders the headline, copy and note', () => {
    render(<HeroPhoneSplit title="Posts in seconds" description="Copy here" note="Free forever" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Posts in seconds' })).toBeInTheDocument()
    expect(screen.getByText('Copy here')).toBeInTheDocument()
    expect(screen.getByText('Free forever')).toBeInTheDocument()
  })

  it('renders a link for an action with href and a button otherwise', () => {
    const onClick = vi.fn()
    render(<HeroPhoneSplit title="T" primaryAction={{ label: 'Get', href: '/get' }} secondaryAction={{ label: 'Demo', onClick }} />)
    expect(screen.getByRole('link', { name: 'Get' })).toHaveAttribute('href', '/get')
    fireEvent.click(screen.getByRole('button', { name: 'Demo' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('shows the floating chips next to the phone', () => {
    render(<HeroPhoneSplit title="T" chips={[{ label: 'Reach', value: '+248%' }, { label: 'Queue', value: '12 posts' }]} />)
    expect(screen.getByText('+248%')).toBeInTheDocument()
    expect(screen.getByText('12 posts')).toBeInTheDocument()
  })

  it('swaps the phone screen for custom content and hides the mock-up from assistive tech', () => {
    render(<HeroPhoneSplit title="T" screen={<span>Custom screen</span>} />)
    expect(screen.getByText('Custom screen').closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
