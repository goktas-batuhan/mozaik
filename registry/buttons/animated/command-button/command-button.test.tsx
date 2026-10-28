import { fireEvent, render, screen } from '@testing-library/react'
import { CommandButton } from './command-button'

describe('CommandButton', () => {
  it('renders the label and announces its shortcut', () => {
    render(<CommandButton shortcut="mod+k">Search</CommandButton>)
    const button = screen.getByRole('button', { name: 'Search' })
    expect(button).toHaveAttribute('aria-keyshortcuts', expect.stringMatching(/^(Control|Meta)\+K$/))
  })

  it('clicks the button when the shortcut is pressed anywhere on the page', () => {
    const onClick = vi.fn()
    render(<CommandButton shortcut="ctrl+k" onClick={onClick}>Search</CommandButton>)
    fireEvent.keyDown(window, { key: 'k', code: 'KeyK', ctrlKey: true })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('ignores a different combination and a disabled button', () => {
    const onClick = vi.fn()
    const { rerender } = render(<CommandButton shortcut="ctrl+k" onClick={onClick}>Search</CommandButton>)
    fireEvent.keyDown(window, { key: 'k', code: 'KeyK' })
    fireEvent.keyDown(window, { key: 'j', code: 'KeyJ', ctrlKey: true })
    expect(onClick).not.toHaveBeenCalled()
    rerender(<CommandButton shortcut="ctrl+k" disabled onClick={onClick}>Search</CommandButton>)
    fireEvent.keyDown(window, { key: 'k', code: 'KeyK', ctrlKey: true })
    expect(onClick).not.toHaveBeenCalled()
  })

  it('skips plain-key shortcuts while typing in a field', () => {
    const onClick = vi.fn()
    render(
      <>
        <input aria-label="note" />
        <CommandButton shortcut="n" onClick={onClick}>New</CommandButton>
      </>,
    )
    fireEvent.keyDown(screen.getByLabelText('note'), { key: 'n', code: 'KeyN' })
    expect(onClick).not.toHaveBeenCalled()
    fireEvent.keyDown(document.body, { key: 'n', code: 'KeyN' })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('sinks the keycaps while the keys are held and ignores the page when global is off', () => {
    const onClick = vi.fn()
    const { container, rerender } = render(<CommandButton shortcut="ctrl+k">Search</CommandButton>)
    fireEvent.keyDown(window, { key: 'Control', code: 'ControlLeft', ctrlKey: true })
    expect(container.querySelectorAll('kbd[data-pressed]')).toHaveLength(1)
    fireEvent.keyUp(window, { key: 'Control', code: 'ControlLeft' })
    expect(container.querySelectorAll('kbd[data-pressed]')).toHaveLength(0)
    rerender(<CommandButton shortcut="ctrl+k" global={false} onClick={onClick}>Search</CommandButton>)
    fireEvent.keyDown(window, { key: 'k', code: 'KeyK', ctrlKey: true })
    expect(onClick).not.toHaveBeenCalled()
  })
})
