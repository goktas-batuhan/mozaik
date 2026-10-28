import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { BlurScrim } from './blur-scrim'

describe('BlurScrim', () => {
  it('renders nothing while inactive', () => {
    const { container } = render(<BlurScrim active={false}>Locked</BlurScrim>)
    expect(container.querySelector('[data-slot="scrim"]')).toBeNull()
  })

  it('shows its children when active', () => {
    render(<BlurScrim active>Locked</BlurScrim>)
    expect(screen.getByText('Locked')).toBeInTheDocument()
  })

  it('applies the blur and the dim to the backdrop', () => {
    const { container } = render(<BlurScrim active blur={12} dim={0.4} />)
    const scrim = container.querySelector('[data-slot="scrim"]') as HTMLElement
    expect(scrim.style.backdropFilter).toBe('blur(12px)')
    expect(scrim.style.backgroundColor).toContain('40%')
  })

  it('dismisses on a backdrop click but not on a click inside the content', () => {
    const onDismiss = vi.fn()
    const { container } = render(
      <BlurScrim active onDismiss={onDismiss}>
        <button>Inside</button>
      </BlurScrim>,
    )
    fireEvent.click(screen.getByText('Inside'))
    expect(onDismiss).not.toHaveBeenCalled()
    fireEvent.click(container.querySelector('[data-slot="scrim"]') as Element)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('dismisses on Escape and unmounts when turned off', async () => {
    const onDismiss = vi.fn()
    const { container, rerender } = render(<BlurScrim active onDismiss={onDismiss} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onDismiss).toHaveBeenCalledTimes(1)
    rerender(<BlurScrim active={false} onDismiss={onDismiss} />)
    await waitFor(() => expect(container.querySelector('[data-slot="scrim"]')).toBeNull())
  })
})
