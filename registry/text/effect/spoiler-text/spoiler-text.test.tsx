import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { SpoilerText } from './spoiler-text'

beforeAll(() => {
  // jsdom has no canvas context, ResizeObserver or IntersectionObserver.
  HTMLCanvasElement.prototype.getContext = (() => null) as never
  const observer = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  vi.stubGlobal('ResizeObserver', observer)
  vi.stubGlobal('IntersectionObserver', observer)
})

describe('SpoilerText', () => {
  it('reads as a spoiler while hidden, and hides the text from assistive tech', () => {
    render(<SpoilerText>the butler did it</SpoilerText>)
    const button = screen.getByRole('button', { name: 'Spoiler, press to reveal' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('the butler did it')).toHaveAttribute('aria-hidden', 'true')
  })

  it('opens with Enter and Space and then reads the text', () => {
    const onChange = vi.fn()
    const { unmount } = render(<SpoilerText onRevealedChange={onChange}>secret</SpoilerText>)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith(true)
    const button = screen.getByRole('button', { name: 'secret' })
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('secret')).not.toHaveAttribute('aria-hidden')
    unmount()

    render(<SpoilerText>other</SpoilerText>)
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' })
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('opens on click and is focusable until opened', () => {
    render(<SpoilerText>secret</SpoilerText>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('tabindex', '0')
    fireEvent.click(button, { clientX: 5, clientY: 5 })
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveAttribute('tabindex', '-1')
  })

  it('drops the specks at once under reduced motion', () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <SpoilerText>secret</SpoilerText>
      </MotionConfig>,
    )
    expect(container.querySelector('canvas')).not.toBeNull()
    fireEvent.click(screen.getByRole('button'), { clientX: 5, clientY: 5 })
    expect(container.querySelector('canvas')).toBeNull()
  })

  it('shows plain text when disabled', () => {
    const { container } = render(<SpoilerText disabled>plain</SpoilerText>)
    expect(screen.queryByRole('button')).toBeNull()
    expect(container.textContent).toBe('plain')
  })
})
