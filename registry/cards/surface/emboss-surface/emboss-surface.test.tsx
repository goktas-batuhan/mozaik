import { fireEvent, render, screen } from '@testing-library/react'
import { EmbossSurface } from './emboss-surface'

function stubHover(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches, media: query, addEventListener() {}, removeEventListener() {} }))
}
afterEach(() => vi.unstubAllGlobals())

describe('EmbossSurface', () => {
  it('renders its children in a div by default and as another element on request', () => {
    const { rerender } = render(<EmbossSurface>Plate</EmbossSurface>)
    expect(screen.getByText('Plate').tagName).toBe('DIV')
    rerender(<EmbossSurface as="section">Plate</EmbossSurface>)
    expect(screen.getByText('Plate').tagName).toBe('SECTION')
  })

  it('raises the surface with an outer shadow and presses it in with an inset one', () => {
    const { rerender } = render(<EmbossSurface variant="emboss">x</EmbossSurface>)
    expect(screen.getByText('x').style.boxShadow).not.toContain('inset')
    rerender(<EmbossSurface variant="deboss">x</EmbossSurface>)
    expect(screen.getByText('x').style.boxShadow).toContain('inset')
  })

  it('moves the highlight to the lit side as the light angle changes', () => {
    const { rerender } = render(<EmbossSurface lightAngle={180} depth={4}>x</EmbossSurface>)
    // light from the left: the highlight sits 4px to the left of the surface
    expect(screen.getByText('x').style.boxShadow.startsWith('-4px')).toBe(true)
    rerender(<EmbossSurface lightAngle={0} depth={4}>x</EmbossSurface>)
    expect(screen.getByText('x').style.boxShadow.startsWith('4px')).toBe(true)
  })

  it('carves only the letters when targeting text', () => {
    render(<EmbossSurface target="text">x</EmbossSurface>)
    expect(screen.getByText('x').style.textShadow).not.toBe('')
    expect(screen.getByText('x').style.boxShadow).toBe('')
  })

  it('swings the light toward the pointer only when interactive on a hover device', () => {
    stubHover(true)
    render(<EmbossSurface interactive lightAngle={135}>x</EmbossSurface>)
    const el = screen.getByText('x')
    el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON() {} })
    fireEvent.pointerMove(el, { clientX: 100, clientY: 50 })
    expect(el).toHaveAttribute('data-angle', '0')
    fireEvent.pointerLeave(el)
    expect(el).toHaveAttribute('data-angle', '135')
  })
})
