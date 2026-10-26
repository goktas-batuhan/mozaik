import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { afterEach, vi } from 'vitest'
import { CursorImageTrail } from './cursor-image-trail'

const items = [<span key="a">One</span>, <span key="b">Two</span>]

function mockFinePointer(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        addEventListener() {},
        removeEventListener() {},
      }) as unknown as MediaQueryList,
  )
}

afterEach(() => vi.restoreAllMocks())

describe('CursorImageTrail', () => {
  it('renders its children and, without a fine pointer, no trail layer', () => {
    const { container } = render(
      <CursorImageTrail items={items}>
        <h3>Panel</h3>
      </CursorImageTrail>,
    )
    expect(screen.getByRole('heading', { name: 'Panel' })).toBeInTheDocument()
    expect(container.querySelector('[aria-hidden]')).toBeNull()
  })

  it('keeps the trail pool decorative and click-through', () => {
    mockFinePointer(true)
    const { container } = render(<CursorImageTrail items={items} poolSize={4}>Panel</CursorImageTrail>)
    const layer = container.querySelector('[aria-hidden="true"]')
    expect(layer).toHaveClass('pointer-events-none')
    expect(layer?.children).toHaveLength(4)
  })

  it('draws nothing when disabled, empty, or under reduced motion', () => {
    mockFinePointer(true)
    const off = render(
      <CursorImageTrail items={items} disabled>
        Panel
      </CursorImageTrail>,
    )
    expect(off.container.querySelector('[aria-hidden]')).toBeNull()
    off.unmount()

    const empty = render(<CursorImageTrail items={[]}>Panel</CursorImageTrail>)
    expect(empty.container.querySelector('[aria-hidden]')).toBeNull()
    empty.unmount()

    const calm = render(
      <MotionConfig reducedMotion="always">
        <CursorImageTrail items={items}>Panel</CursorImageTrail>
      </MotionConfig>,
    )
    expect(calm.container.querySelector('[aria-hidden]')).toBeNull()
  })

  it('passes className to the area', () => {
    const { container } = render(
      <CursorImageTrail items={items} className="h-40">
        Panel
      </CursorImageTrail>,
    )
    expect(container.firstElementChild).toHaveClass('h-40')
  })
})
