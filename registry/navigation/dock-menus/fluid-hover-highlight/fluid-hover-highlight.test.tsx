import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRef } from 'react'
import { FluidHoverHighlight, useFluidHover } from './fluid-hover-highlight'

const box = (top: number): DOMRect =>
  ({ top, bottom: top + 40, left: 0, right: 200, width: 200, height: 40, x: 0, y: top, toJSON: () => ({}) }) as DOMRect

function List() {
  const ref = useRef<HTMLUListElement>(null)
  const hover = useFluidHover(ref)
  return (
    <ul ref={ref} data-testid="list" className="relative" {...hover.containerProps}>
      <FluidHoverHighlight rect={hover.rect} session={hover.session} />
      {['One', 'Two', 'Three'].map((label, i) => (
        <li key={label}>
          <button type="button" {...hover.getItemProps(i)}>
            {label}
          </button>
        </li>
      ))}
    </ul>
  )
}

function mockLayout() {
  const list = screen.getByTestId('list')
  vi.spyOn(list, 'getBoundingClientRect').mockReturnValue(box(0))
  screen.getAllByRole('button').forEach((button, i) => {
    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(box(i * 40))
  })
  return list
}

describe('FluidHoverHighlight', () => {
  it('renders nothing without a rect', () => {
    const { container } = render(<FluidHoverHighlight rect={null} />)
    expect(container.querySelector('[data-slot="fluid-hover-highlight"]')).toBeNull()
  })

  it('draws the highlight at the given rect and hides it from assistive tech', () => {
    const { container } = render(
      <div className="relative">
        <FluidHoverHighlight rect={{ top: 10, left: 4, width: 120, height: 32 }} />
      </div>,
    )
    const el = container.querySelector<HTMLElement>('[data-slot="fluid-hover-highlight"]')
    expect(el).not.toBeNull()
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el).toHaveStyle({ width: '120px', height: '32px' })
  })
})

describe('useFluidHover', () => {
  it('lights the item under the pointer and clears on leave', async () => {
    const { container } = render(<List />)
    const list = mockLayout()
    fireEvent.pointerEnter(list)
    fireEvent.pointerMove(list, { clientX: 50, clientY: 50, pointerType: 'mouse' })
    const el = container.querySelector<HTMLElement>('[data-slot="fluid-hover-highlight"]')
    expect(el).toHaveStyle({ height: '40px', width: '200px' })
    fireEvent.pointerLeave(list)
    await waitFor(() => expect(container.querySelector('[data-slot="fluid-hover-highlight"]')).toBeNull())
  })

  it('routes pointer positions in gaps to the nearest item', () => {
    const { container } = render(<List />)
    const list = mockLayout()
    fireEvent.pointerEnter(list)
    // y=500 is below every row; the third row is nearest.
    fireEvent.pointerMove(list, { clientX: 50, clientY: 500, pointerType: 'mouse' })
    expect(container.querySelector('[data-slot="fluid-hover-highlight"]')).not.toBeNull()
  })

  it('follows keyboard focus', () => {
    const { container } = render(<List />)
    mockLayout()
    expect(container.querySelector('[data-slot="fluid-hover-highlight"]')).toBeNull()
    act(() => screen.getByRole('button', { name: 'Two' }).focus())
    expect(container.querySelector('[data-slot="fluid-hover-highlight"]')).not.toBeNull()
  })
})
