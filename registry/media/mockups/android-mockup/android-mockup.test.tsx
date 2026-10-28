import { render, screen } from '@testing-library/react'
import { AndroidMockup } from './android-mockup'

describe('AndroidMockup', () => {
  it('renders its children as the screen', () => {
    render(<AndroidMockup><h1>Welcome</h1></AndroidMockup>)
    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument()
  })

  it('draws the frame as hidden decoration', () => {
    const { container } = render(<AndroidMockup />)
    const decor = [...container.querySelectorAll('[aria-hidden="true"]')]
    expect(decor.length).toBeGreaterThanOrEqual(4)
    expect(decor.every((n) => n.textContent === '')).toBe(true)
  })

  it('toggles the gesture bar and forwards props', () => {
    const { container, rerender } = render(<AndroidMockup data-testid="phone" />)
    const withBar = container.querySelectorAll('span[aria-hidden]').length
    expect(screen.getByTestId('phone').style.aspectRatio).toContain('378')
    rerender(<AndroidMockup gestureBar={false} />)
    expect(container.querySelectorAll('span[aria-hidden]').length).toBe(withBar - 1)
  })
})
