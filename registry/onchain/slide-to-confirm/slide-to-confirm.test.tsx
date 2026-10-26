import { act, fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { SlideToConfirm } from './slide-to-confirm'

class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
beforeAll(() => {
  vi.stubGlobal('ResizeObserver', RO)
})

describe('SlideToConfirm', () => {
  it('renders a labelled button in the idle phase', () => {
    const { container } = render(<SlideToConfirm label="Slide to send" />)
    const button = screen.getByRole('button', { name: /Slide to send/ })
    expect(button).toBeEnabled()
    expect(container.firstElementChild).toHaveAttribute('data-phase', 'idle')
  })

  it('confirms from the keyboard and announces the result', async () => {
    const onConfirm = vi.fn()
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <SlideToConfirm onConfirm={onConfirm} resetAfter={null} confirmingLabel="Sending" doneLabel="Sent" />
      </MotionConfig>,
    )
    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: 'ArrowRight' })
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveTextContent('Sending')
    await act(async () => {
      await new Promise((r) => setTimeout(r, 30))
    })
    expect(container.firstElementChild).toHaveAttribute('data-phase', 'done')
    expect(screen.getByRole('status')).toHaveTextContent('Sent')
  })

  it('confirms on Enter or Space (a click with no pointer)', () => {
    const onConfirm = vi.fn()
    render(
      <MotionConfig reducedMotion="always">
        <SlideToConfirm onConfirm={onConfirm} resetAfter={null} />
      </MotionConfig>,
    )
    fireEvent.click(screen.getByRole('button'), { detail: 0 })
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('does nothing when disabled', () => {
    const onConfirm = vi.fn()
    render(<SlideToConfirm disabled onConfirm={onConfirm} />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    fireEvent.keyDown(button, { key: 'ArrowRight' })
    fireEvent.click(button, { detail: 0 })
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('goes back to the start when onConfirm rejects', async () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <SlideToConfirm onConfirm={() => Promise.reject(new Error('rejected'))} />
      </MotionConfig>,
    )
    fireEvent.keyDown(screen.getByRole('button'), { key: 'ArrowRight' })
    await act(async () => {
      await new Promise((r) => setTimeout(r, 30))
    })
    expect(container.firstElementChild).toHaveAttribute('data-phase', 'idle')
  })

  it('skips the busy floor and the spinner spin under reduced motion', () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <SlideToConfirm />
      </MotionConfig>,
    )
    expect(container.querySelector('.animate-spin')).toBeNull()
  })
})
