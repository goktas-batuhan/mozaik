import { fireEvent, render, screen } from '@testing-library/react'
import { CardFlip } from './card-flip'

const faces = { front: <span>Front text</span>, back: <span>Back text</span> }

function stubHover(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches, media: query, addEventListener() {}, removeEventListener() {} }))
}
afterEach(() => vi.unstubAllGlobals())

describe('CardFlip', () => {
  it('is a toggle button that starts on the front', () => {
    const { container } = render(<CardFlip {...faces} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
    expect(container.querySelector('[data-face="back"]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('flips on click and flips back', () => {
    const onFlippedChange = vi.fn()
    const { container } = render(<CardFlip {...faces} onFlippedChange={onFlippedChange} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onFlippedChange).toHaveBeenLastCalledWith(true)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('[data-face="front"]')).toHaveAttribute('aria-hidden', 'true')
    fireEvent.click(screen.getByRole('button'))
    expect(onFlippedChange).toHaveBeenLastCalledWith(false)
  })

  it('flips on mouse hover only with the hover trigger on a hover device', () => {
    stubHover(true)
    const { rerender } = render(<CardFlip {...faces} trigger="hover" />)
    fireEvent.pointerEnter(screen.getByRole('button'), { pointerType: 'mouse' })
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
    fireEvent.pointerLeave(screen.getByRole('button'), { pointerType: 'mouse' })
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
    rerender(<CardFlip {...faces} trigger="click" />)
    fireEvent.pointerEnter(screen.getByRole('button'), { pointerType: 'mouse' })
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('ignores hover on touch devices', () => {
    stubHover(false)
    render(<CardFlip {...faces} trigger="hover" />)
    fireEvent.pointerEnter(screen.getByRole('button'), { pointerType: 'mouse' })
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('stays controlled when flipped is given', () => {
    const onFlippedChange = vi.fn()
    render(<CardFlip {...faces} flipped={false} onFlippedChange={onFlippedChange} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onFlippedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })
})
