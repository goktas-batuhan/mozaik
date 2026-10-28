import { act, fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { SignaturePad } from './signature-pad'

// jsdom has no canvas drawing, so these tests cover the stroke bookkeeping, the SVG output and the
// controls. Animation frames are driven by hand.
let frames: FrameRequestCallback[] = []
function flushFrames(times = 3) {
  for (let i = 0; i < times; i++) {
    const batch = frames
    frames = []
    for (const cb of batch) cb(performance.now() + i * 16)
  }
}

beforeEach(() => {
  frames = []
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => frames.push(cb))
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
    frames = []
  })
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
})

afterEach(() => vi.restoreAllMocks())

function sign(canvas: HTMLElement) {
  fireEvent.pointerDown(canvas, { clientX: 20, clientY: 20, button: 0, pointerId: 1 })
  fireEvent.pointerUp(canvas, { pointerId: 1 })
  act(() => flushFrames())
}

describe('SignaturePad', () => {
  it('starts empty and exposes the drawing area by name', () => {
    render(<SignaturePad label="Customer signature" />)
    expect(screen.getByRole('img', { name: 'Customer signature, empty' })).toBeInTheDocument()
    expect(screen.getByText('Draw your signature')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled()
  })

  it('reports the signature as SVG once a stroke is finished', () => {
    const onChange = vi.fn()
    render(<SignaturePad onChange={onChange} />)
    sign(screen.getByRole('img'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)
    expect(screen.getByRole('img', { name: 'Signature, 1 stroke' })).toBeInTheDocument()
    expect(screen.getByText('Signed')).toBeInTheDocument()
  })

  it('undoes the last stroke and reports null when nothing is left', () => {
    const onChange = vi.fn()
    render(<SignaturePad onChange={onChange} />)
    sign(screen.getByRole('img'))
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(screen.getByText('Draw your signature')).toBeInTheDocument()
  })

  it('undoes with Ctrl+Z and clears with Backspace under reduced motion', () => {
    const onChange = vi.fn()
    render(
      <MotionConfig reducedMotion="always">
        <SignaturePad onChange={onChange} />
      </MotionConfig>,
    )
    const canvas = screen.getByRole('img')
    sign(canvas)
    sign(canvas)
    expect(screen.getByRole('img', { name: 'Signature, 2 strokes' })).toBeInTheDocument()
    fireEvent.keyDown(canvas, { key: 'z', ctrlKey: true })
    expect(screen.getByRole('img', { name: 'Signature, 1 stroke' })).toBeInTheDocument()
    fireEvent.keyDown(canvas, { key: 'Backspace' })
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(screen.getByRole('img', { name: 'Signature, empty' })).toBeInTheDocument()
  })
})
