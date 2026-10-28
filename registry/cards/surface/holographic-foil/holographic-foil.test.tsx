import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { HolographicFoil } from './holographic-foil'

function stubHover(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches, media: query, addEventListener() {}, removeEventListener() {} }))
}
afterEach(() => vi.unstubAllGlobals())

const rect = { left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0, toJSON() {} }

describe('HolographicFoil', () => {
  it('renders its content over the foil layers', () => {
    const { container } = render(<HolographicFoil>Edition 42</HolographicFoil>)
    expect(screen.getByText('Edition 42')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="foil"]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('shifts the foil with the pointer on hover devices', () => {
    stubHover(true)
    render(<HolographicFoil>x</HolographicFoil>)
    const card = screen.getByText('x')
    card.getBoundingClientRect = () => rect
    fireEvent.pointerMove(card, { clientX: 150, clientY: 25 })
    expect(card.style.getPropertyValue('--foil-x')).toBe('75%')
    expect(card.style.getPropertyValue('--foil-y')).toBe('25%')
    expect(card).toHaveAttribute('data-active', 'true')
  })

  it('returns to the resting foil when the pointer leaves', () => {
    stubHover(true)
    render(<HolographicFoil>x</HolographicFoil>)
    const card = screen.getByText('x')
    card.getBoundingClientRect = () => rect
    fireEvent.pointerMove(card, { clientX: 150, clientY: 25 })
    fireEvent.pointerLeave(card)
    expect(card.style.getPropertyValue('--foil-x')).toBe('35%')
    expect(card).not.toHaveAttribute('data-active')
  })

  it('keeps the foil still on touch devices and under reduced motion', () => {
    stubHover(false)
    const { unmount } = render(<HolographicFoil>x</HolographicFoil>)
    fireEvent.pointerMove(screen.getByText('x'), { clientX: 150, clientY: 25 })
    expect(screen.getByText('x').style.getPropertyValue('--foil-x')).toBe('35%')
    unmount()
    stubHover(true)
    render(
      <MotionConfig reducedMotion="always">
        <HolographicFoil>y</HolographicFoil>
      </MotionConfig>,
    )
    fireEvent.pointerMove(screen.getByText('y'), { clientX: 150, clientY: 25 })
    expect(screen.getByText('y').style.getPropertyValue('--foil-x')).toBe('35%')
  })

  it('drops the diffraction lines when grating is off', () => {
    const { container } = render(<HolographicFoil grating={false}>x</HolographicFoil>)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2)
  })
})
