import { render, screen } from '@testing-library/react'
import { BlurFade } from './blur-fade'

describe('BlurFade', () => {
  it('renders its children', () => {
    render(<BlurFade>Hello</BlurFade>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('starts hidden and blurred', () => {
    render(<BlurFade blur={8}>Hello</BlurFade>)
    const el = screen.getByText('Hello')
    expect(el.style.opacity).toBe('0')
    expect(el.style.filter).toContain('blur(8px)')
  })

  it('renders plain content when disabled', () => {
    render(
      <BlurFade disabled className="x">
        Hello
      </BlurFade>,
    )
    const el = screen.getByText('Hello')
    expect(el.style.opacity).toBe('')
    expect(el).toHaveClass('x')
  })
})
