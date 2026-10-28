import { render, screen } from '@testing-library/react'
import { HexagonPattern } from './hexagon-pattern'

describe('HexagonPattern', () => {
  it('renders children above a hidden, non-interactive pattern', () => {
    const { container } = render(
      <HexagonPattern>
        <h1>Hive</h1>
      </HexagonPattern>,
    )
    expect(screen.getByRole('heading', { name: 'Hive' })).toBeInTheDocument()
    const svg = container.querySelector('[data-hexagon-pattern]')!
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveClass('pointer-events-none')
  })

  it('draws six-cornered hexagons', () => {
    const { container } = render(<HexagonPattern />)
    const polygon = container.querySelector('pattern polygon')!
    expect(polygon.getAttribute('points')!.split(' ')).toHaveLength(6)
  })

  it('sizes the repeating tile from radius and direction', () => {
    const { container, rerender } = render(<HexagonPattern radius={40} direction="horizontal" />)
    const flat = container.querySelector('pattern')!
    expect(Number(flat.getAttribute('width'))).toBeCloseTo(120)
    expect(Number(flat.getAttribute('height'))).toBeCloseTo(40 * Math.sqrt(3))
    rerender(<HexagonPattern radius={40} direction="vertical" />)
    const pointy = container.querySelector('pattern')!
    expect(Number(pointy.getAttribute('width'))).toBeCloseTo(40 * Math.sqrt(3))
    expect(Number(pointy.getAttribute('height'))).toBeCloseTo(120)
  })

  it('fills one cell per highlight entry', () => {
    const { container } = render(<HexagonPattern highlight={[[1, 1], [2, 3]]} />)
    expect(container.querySelectorAll('[data-lit]')).toHaveLength(2)
  })

  it('only masks the edges when fade is on', () => {
    const { container, rerender } = render(<HexagonPattern />)
    expect((container.querySelector('svg') as SVGElement).style.maskImage).not.toBe('')
    rerender(<HexagonPattern fade={false} />)
    expect((container.querySelector('svg') as SVGElement).style.maskImage ?? '').toBe('')
  })
})
