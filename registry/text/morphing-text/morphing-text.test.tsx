import { act, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { MorphingText } from './morphing-text'

beforeAll(() => {
  // jsdom has no IntersectionObserver.
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  )
})

describe('MorphingText', () => {
  it('exposes every word to assistive tech and hides the morph', () => {
    const { container } = render(<MorphingText words={['one', 'two', 'three']} />)
    expect(screen.getByText('one, two, three', { selector: '.sr-only' })).toBeInTheDocument()
    expect(container.querySelector('.sr-only')?.hasAttribute('aria-hidden')).toBe(false)
    expect(container.querySelectorAll('[aria-hidden]').length).toBeGreaterThan(0)
  })

  it('starts on the first word with the second waiting behind it', () => {
    const { container } = render(<MorphingText words={['one', 'two']} />)
    const layers = container.querySelectorAll('[aria-hidden] > span:not(.invisible)')
    expect(layers[0]?.textContent).toBe('one')
    expect(layers[1]?.textContent).toBe('two')
    expect((layers[1] as HTMLElement).style.opacity).toBe('0')
  })

  it('shows plain first word when disabled', () => {
    const { container } = render(<MorphingText words={['one', 'two']} disabled />)
    expect(container.textContent).toBe('one')
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(0)
  })

  it('holds the first word under reduced motion', () => {
    vi.useFakeTimers()
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <MorphingText words={['one', 'two']} interval={0.1} duration={0.1} />
      </MotionConfig>,
    )
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(container.textContent).toBe('one')
    expect(container.querySelector('svg')).toBeNull()
    vi.useRealTimers()
  })

  it('renders the requested element', () => {
    render(<MorphingText as="h1" words={['solo']} />)
    expect(screen.getByRole('heading', { name: 'solo' })).toBeInTheDocument()
  })
})
