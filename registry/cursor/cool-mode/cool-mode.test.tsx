import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { afterEach, vi } from 'vitest'
import { CoolMode } from './cool-mode'

function mockFinePointer(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        addEventListener() {},
        removeEventListener() {},
      }) as unknown as MediaQueryList,
  )
}

afterEach(() => vi.restoreAllMocks())

describe('CoolMode', () => {
  it('renders and keeps its child focusable', () => {
    render(
      <CoolMode>
        <button type="button">Press</button>
      </CoolMode>,
    )
    const button = screen.getByRole('button', { name: 'Press' })
    button.focus()
    expect(button).toHaveFocus()
  })

  it('adds no extra layer until a press, then a decorative click-through canvas', () => {
    mockFinePointer(true)
    const { container } = render(
      <CoolMode>
        <button type="button">Press</button>
      </CoolMode>,
    )
    expect(document.querySelector('canvas')).toBeNull()
    fireEvent.pointerDown(screen.getByRole('button'), { clientX: 5, clientY: 5, pointerType: 'mouse' })
    const canvas = document.querySelector('canvas')
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
    expect(canvas).toHaveClass('pointer-events-none')
    expect(container.querySelector('canvas')).toBeNull()
  })

  it('does nothing on touch devices, when disabled or under reduced motion', () => {
    const press = () => fireEvent.pointerDown(screen.getByRole('button'), { pointerType: 'mouse' })
    mockFinePointer(false)
    const touch = render(
      <CoolMode>
        <button type="button">Press</button>
      </CoolMode>,
    )
    press()
    expect(document.querySelector('canvas')).toBeNull()
    touch.unmount()

    mockFinePointer(true)
    const off = render(
      <CoolMode disabled>
        <button type="button">Press</button>
      </CoolMode>,
    )
    press()
    expect(document.querySelector('canvas')).toBeNull()
    off.unmount()

    render(
      <MotionConfig reducedMotion="always">
        <CoolMode>
          <button type="button">Press</button>
        </CoolMode>
      </MotionConfig>,
    )
    press()
    expect(document.querySelector('canvas')).toBeNull()
  })

  it('removes the canvas on unmount', () => {
    mockFinePointer(true)
    const { unmount } = render(
      <CoolMode>
        <button type="button">Press</button>
      </CoolMode>,
    )
    fireEvent.pointerDown(screen.getByRole('button'), { pointerType: 'mouse' })
    expect(document.querySelector('canvas')).not.toBeNull()
    unmount()
    expect(document.querySelector('canvas')).toBeNull()
  })

  it('passes className to the wrapper', () => {
    const { container } = render(
      <CoolMode className="ml-2">
        <span>x</span>
      </CoolMode>,
    )
    expect(container.firstElementChild).toHaveClass('ml-2')
  })
})
