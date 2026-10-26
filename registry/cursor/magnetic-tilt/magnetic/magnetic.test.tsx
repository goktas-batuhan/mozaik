import { fireEvent, render, screen } from '@testing-library/react'
import { Magnetic } from './magnetic'

describe('Magnetic', () => {
  it('renders its child', () => {
    render(
      <Magnetic>
        <button type="button">Press</button>
      </Magnetic>,
    )
    expect(screen.getByRole('button', { name: 'Press' })).toBeInTheDocument()
  })

  it('keeps the child focusable', () => {
    render(
      <Magnetic>
        <a href="#x">Link</a>
      </Magnetic>,
    )
    const link = screen.getByRole('link', { name: 'Link' })
    link.focus()
    expect(link).toHaveFocus()
  })

  it('does not move on a coarse pointer', () => {
    // jsdom reports no fine pointer, so the pull stays off.
    const { container } = render(
      <Magnetic strength={1}>
        <span>Icon</span>
      </Magnetic>,
    )
    fireEvent.pointerMove(window, { clientX: 5, clientY: 5 })
    const inner = container.firstElementChild!.firstElementChild as HTMLElement
    expect(inner.style.transform).toBe('')
  })

  it('passes className to the wrapper', () => {
    const { container } = render(
      <Magnetic className="ml-2" disabled>
        <span>Icon</span>
      </Magnetic>,
    )
    expect(container.firstElementChild).toHaveClass('ml-2')
  })
})
