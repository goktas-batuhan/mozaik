import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { SplitFlapText } from './split-flap-text'

describe('SplitFlapText', () => {
  it('exposes every line to assistive tech and hides the tiles', () => {
    const { container } = render(<SplitFlapText words={['Gate 1', 'On time']} />)
    expect(screen.getByText('Gate 1, On time', { selector: '.sr-only' })).toBeInTheDocument()
    const tiles = container.querySelectorAll('[aria-hidden]')
    expect(tiles.length).toBe('ON TIME'.length)
  })

  it('pads every line to the longest one', () => {
    const { container } = render(<SplitFlapText words={['Hi', 'Longer']} />)
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(6)
  })

  it('shows the first line only when disabled', () => {
    const { container } = render(<SplitFlapText words={['One', 'Two']} disabled />)
    const tiles = [...container.querySelectorAll('[aria-hidden]')]
    expect(tiles.map((t) => t.textContent?.slice(0, 2)).join('')).toBe('OONNEE')
  })

  it('stays on the first line under reduced motion', () => {
    vi.useFakeTimers()
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <SplitFlapText words={['One', 'Two']} interval={1} />
      </MotionConfig>,
    )
    vi.advanceTimersByTime(5000)
    // Each tile paints its letter twice (top and bottom half).
    const tiles = [...container.querySelectorAll('[aria-hidden]')]
    expect(tiles.map((t) => t.textContent?.slice(0, 2)).join('')).toBe('OONNEE')
    vi.useRealTimers()
  })

  it('renders the requested element', () => {
    render(<SplitFlapText as="h1" words={['Hi']} />)
    expect(screen.getByRole('heading', { name: 'Hi' })).toBeInTheDocument()
  })
})
