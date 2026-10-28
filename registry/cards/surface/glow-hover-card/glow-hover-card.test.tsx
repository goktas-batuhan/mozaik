import { fireEvent, render, screen } from '@testing-library/react'
import { GlowHoverCards } from './glow-hover-card'

const items = ['One', 'Two', 'Three'].map((id) => ({ id, content: <span>{id}</span> }))

function stubHover(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches, media: query, addEventListener() {}, removeEventListener() {} }))
}
afterEach(() => vi.unstubAllGlobals())

describe('GlowHoverCards', () => {
  it('renders every card in a grid with the requested columns', () => {
    const { container } = render(<GlowHoverCards items={items} columns={2} />)
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-slot="card"]')).toHaveLength(3)
    expect((container.firstElementChild as HTMLElement).style.gridTemplateColumns).toContain('repeat(2')
  })

  it('writes the pointer position into each card relative to its own box', () => {
    stubHover(true)
    const { container } = render(<GlowHoverCards items={items} />)
    const cards = container.querySelectorAll<HTMLElement>('[data-slot="card"]')
    cards[0].getBoundingClientRect = () => ({ left: 10, top: 20, width: 100, height: 50, right: 110, bottom: 70, x: 10, y: 20, toJSON() {} })
    cards[1].getBoundingClientRect = () => ({ left: 130, top: 20, width: 100, height: 50, right: 230, bottom: 70, x: 130, y: 20, toJSON() {} })
    fireEvent.pointerMove(container.firstElementChild!, { clientX: 100, clientY: 40 })
    expect(cards[0].style.getPropertyValue('--glow-x')).toBe('90px')
    expect(cards[0].style.getPropertyValue('--glow-y')).toBe('20px')
    expect(cards[1].style.getPropertyValue('--glow-x')).toBe('-30px')
    expect(container.firstElementChild).toHaveAttribute('data-active', 'true')
  })

  it('switches the glow off when the pointer leaves', () => {
    stubHover(true)
    const { container } = render(<GlowHoverCards items={items} />)
    fireEvent.pointerMove(container.firstElementChild!, { clientX: 5, clientY: 5 })
    fireEvent.pointerLeave(container.firstElementChild!)
    expect(container.firstElementChild).not.toHaveAttribute('data-active')
  })

  it('stays dark on touch devices', () => {
    stubHover(false)
    const { container } = render(<GlowHoverCards items={items} />)
    fireEvent.pointerMove(container.firstElementChild!, { clientX: 5, clientY: 5 })
    expect(container.firstElementChild).not.toHaveAttribute('data-active')
  })

  it('exposes glowSize and intensity as CSS variables', () => {
    const { container } = render(<GlowHoverCards items={items} glowSize={240} intensity={0.3} />)
    const grid = container.firstElementChild as HTMLElement
    expect(grid.style.getPropertyValue('--glow-size')).toBe('240px')
    expect(grid.style.getPropertyValue('--glow-fill')).toBe('0.3')
  })
})
