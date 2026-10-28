import { fireEvent, render, screen } from '@testing-library/react'
import { FolderReveal } from './folder-reveal'

const items = ['a', 'b', 'c'].map((id) => ({ id, content: <span>{`Card ${id}`}</span> }))

function stubHover(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches, media: query, addEventListener() {}, removeEventListener() {} }))
}
afterEach(() => vi.unstubAllGlobals())

describe('FolderReveal', () => {
  it('is a closed, expandable button holding all its cards', () => {
    render(<FolderReveal items={items} label="Files" />)
    expect(screen.getByRole('button', { name: 'Files' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Card a')).toBeInTheDocument()
    expect(screen.getByText('Card c')).toBeInTheDocument()
  })

  it('toggles on click and reports it', () => {
    const onOpenChange = vi.fn()
    render(<FolderReveal items={items} onOpenChange={onOpenChange} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(screen.getByRole('button'))
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it('opens under a mouse with the hover trigger on a hover device', () => {
    stubHover(true)
    render(<FolderReveal items={items} trigger="hover" />)
    fireEvent.pointerEnter(screen.getByRole('button'), { pointerType: 'mouse' })
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
    fireEvent.pointerLeave(screen.getByRole('button'), { pointerType: 'mouse' })
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('does not open on hover with the click trigger or on touch devices', () => {
    stubHover(true)
    const { rerender } = render(<FolderReveal items={items} trigger="click" />)
    fireEvent.pointerEnter(screen.getByRole('button'), { pointerType: 'mouse' })
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
    stubHover(false)
    rerender(<FolderReveal key="touch" items={items} trigger="hover" />)
    fireEvent.pointerEnter(screen.getByRole('button'), { pointerType: 'mouse' })
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('stays controlled when open is given', () => {
    const onOpenChange = vi.fn()
    render(<FolderReveal items={items} open={false} onOpenChange={onOpenChange} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })
})
