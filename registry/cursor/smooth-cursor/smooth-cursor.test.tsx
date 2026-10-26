import { act, fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { afterEach, vi } from 'vitest'
import { SmoothCursor } from './smooth-cursor'

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

describe('SmoothCursor', () => {
  it('renders its children and no cursor without a fine pointer', () => {
    const { container } = render(
      <SmoothCursor>
        <button type="button">Press</button>
      </SmoothCursor>,
    )
    expect(screen.getByRole('button', { name: 'Press' })).toBeInTheDocument()
    expect(container.querySelector('[aria-hidden]')).toBeNull()
    expect(container.firstElementChild).not.toHaveClass('cursor-none')
  })

  it('draws a decorative, click-through cursor and hides the system one only in its area', async () => {
    mockFinePointer(true)
    const { container } = render(<SmoothCursor>Area</SmoothCursor>)
    const layer = container.querySelector('[aria-hidden="true"]')
    expect(layer).toHaveClass('pointer-events-none')
    expect(container.firstElementChild).toHaveClass('cursor-none')
    await act(async () => {
      fireEvent.pointerMove(container.firstElementChild!, { clientX: 10, clientY: 10, pointerType: 'mouse' })
    })
    expect(document.body.style.cursor).toBe('')
  })

  it('stays out of the way when disabled', () => {
    mockFinePointer(true)
    const { container } = render(<SmoothCursor disabled>Area</SmoothCursor>)
    expect(container.querySelector('[aria-hidden]')).toBeNull()
    expect(container.firstElementChild).not.toHaveClass('cursor-none')
  })

  it('keeps the system cursor under reduced motion', () => {
    mockFinePointer(true)
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <SmoothCursor>Area</SmoothCursor>
      </MotionConfig>,
    )
    expect(container.querySelector('[aria-hidden]')).toBeNull()
    expect(container.firstElementChild).not.toHaveClass('cursor-none')
  })
})
