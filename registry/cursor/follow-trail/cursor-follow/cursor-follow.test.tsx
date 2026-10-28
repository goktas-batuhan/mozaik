import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { afterEach, vi } from 'vitest'
import { CursorFollow } from './cursor-follow'

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

const move = (el: Element) =>
  act(async () => {
    fireEvent.pointerMove(el, { clientX: 20, clientY: 30, pointerType: 'mouse' })
  })

describe('CursorFollow', () => {
  it('renders its children and leaves the system cursor alone without a fine pointer', () => {
    const { container } = render(
      <CursorFollow>
        <button type="button">Press</button>
      </CursorFollow>,
    )
    expect(screen.getByRole('button', { name: 'Press' })).toBeInTheDocument()
    expect(container.querySelector('[data-bubble]')).toBeNull()
    expect(container.firstElementChild).not.toHaveClass('cursor-none')
  })

  it('shows a decorative, click-through bubble once the cursor moves in the area', async () => {
    mockFinePointer(true)
    const { container } = render(<CursorFollow>Area</CursorFollow>)
    expect(container.querySelector('[data-bubble]')).toBeNull()
    await move(container.firstElementChild!)
    const bubble = container.querySelector('[data-bubble]')!
    expect(bubble).toHaveAttribute('aria-hidden', 'true')
    expect(bubble).toHaveClass('pointer-events-none')
  })

  it('grows into the label of the element under the cursor', async () => {
    mockFinePointer(true)
    const { container } = render(
      <CursorFollow>
        <a href="#x" data-cursor-text="Open">
          Project
        </a>
        <p>Plain</p>
      </CursorFollow>,
    )
    await move(screen.getByText('Project'))
    expect(container.querySelector('[data-label]')).toHaveTextContent('Open')
    await move(screen.getByText('Plain'))
    expect(container.querySelector('[data-label]')).toBeNull()
  })

  it('drops the bubble when the cursor leaves', async () => {
    mockFinePointer(true)
    const { container } = render(<CursorFollow>Area</CursorFollow>)
    await move(container.firstElementChild!)
    await act(async () => {
      fireEvent.pointerLeave(container.firstElementChild!)
    })
    await waitFor(() => expect(container.querySelector('[data-bubble]')).toBeNull())
  })

  it('stays off under reduced motion', async () => {
    mockFinePointer(true)
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <CursorFollow>Area</CursorFollow>
      </MotionConfig>,
    )
    await move(container.firstElementChild!)
    expect(container.querySelector('[data-bubble]')).toBeNull()
    expect(container.firstElementChild).not.toHaveClass('cursor-none')
  })
})
