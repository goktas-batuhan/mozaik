import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { LightboxGrid } from './lightbox-grid'

const items = ['One', 'Two', 'Three'].map((label) => ({ id: label, label, thumb: <span>t-{label}</span>, content: <span>big-{label}</span> }))

describe('LightboxGrid', () => {
  it('renders a button per tile and no viewer', () => {
    render(<LightboxGrid items={items} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens the large view as a labelled modal and focuses inside', () => {
    const onOpenChange = vi.fn()
    render(<LightboxGrid items={items} onOpenChange={onOpenChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open Two' }))
    const dialog = screen.getByRole('dialog', { name: 'Two' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('big-Two')).toBeInTheDocument()
    expect(dialog.contains(document.activeElement)).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith(1)
  })

  it('steps with the buttons and the arrow keys, wrapping around', () => {
    render(<LightboxGrid items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open Three' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('dialog', { name: 'One' })).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(screen.getByRole('dialog', { name: 'Three' })).toBeInTheDocument()
  })

  it('closes on Escape and gives focus back to the tile', async () => {
    render(<LightboxGrid items={items} />)
    const tile = screen.getByRole('button', { name: 'Open One' })
    tile.focus()
    fireEvent.click(tile)
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(document.activeElement).toBe(tile)
  })

  it('closes from the backdrop', async () => {
    render(<LightboxGrid items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open One' }))
    fireEvent.click(document.querySelector('[data-slot="backdrop"]') as Element)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
})
