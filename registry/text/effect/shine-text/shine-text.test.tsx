import { render, screen } from '@testing-library/react'
import { ShineText } from './shine-text'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('ShineText', () => {
  beforeEach(() => {
    reduced = false
  })

  it('keeps the text in the DOM', () => {
    render(<ShineText>Hello world</ShineText>)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders static text when disabled', () => {
    render(<ShineText disabled>Still</ShineText>)
    expect(screen.getByText('Still').style.backgroundImage).toBe('')
  })

  it('renders static text under reduced motion', () => {
    reduced = true
    render(<ShineText baseColor="red">Calm</ShineText>)
    const el = screen.getByText('Calm')
    expect(el.style.backgroundImage).toBe('')
    expect(el.style.color).toBe('red')
  })
})
