import { render, screen } from '@testing-library/react'
import { WaveText } from './wave-text'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('WaveText', () => {
  beforeEach(() => {
    reduced = false
  })

  it('exposes the full text to assistive tech and hides the letters', () => {
    const { container } = render(<WaveText text="Hello" />)
    expect(screen.getByText('Hello', { selector: '.sr-only' })).toBeInTheDocument()
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(5)
  })

  it('renders plain text when disabled', () => {
    const { container } = render(<WaveText text="Hello" disabled />)
    expect(container.textContent).toBe('Hello')
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(0)
  })

  it('renders plain text under reduced motion', () => {
    reduced = true
    const { container } = render(<WaveText as="h2" text="Calm" />)
    expect(screen.getByRole('heading', { name: 'Calm' })).toBeInTheDocument()
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(0)
  })
})
