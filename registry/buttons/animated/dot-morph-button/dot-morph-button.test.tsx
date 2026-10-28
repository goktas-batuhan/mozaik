import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { DotMorphButton } from './dot-morph-button'

function stubHover(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }))
}

afterEach(() => vi.unstubAllGlobals())

describe('DotMorphButton', () => {
  it('renders a button named by its label', () => {
    render(<DotMorphButton label="Get in touch" />)
    expect(screen.getByRole('button', { name: 'Get in touch' })).toHaveAttribute('type', 'button')
  })

  it('morphs the dot on hover when the device can hover', () => {
    stubHover(true)
    render(<DotMorphButton label="Hi" />)
    const button = screen.getByRole('button')
    fireEvent.pointerEnter(button)
    expect(button).toHaveAttribute('data-morphed', 'true')
    fireEvent.pointerLeave(button)
    expect(button).not.toHaveAttribute('data-morphed')
  })

  it('stays a dot on touch devices', () => {
    stubHover(false)
    render(<DotMorphButton label="Hi" />)
    const button = screen.getByRole('button')
    fireEvent.pointerEnter(button)
    expect(button).not.toHaveAttribute('data-morphed')
  })

  it('never morphs under reduced motion', () => {
    stubHover(true)
    render(
      <MotionConfig reducedMotion="always">
        <DotMorphButton label="Hi" />
      </MotionConfig>,
    )
    const button = screen.getByRole('button')
    fireEvent.pointerEnter(button)
    expect(button).not.toHaveAttribute('data-morphed')
  })

  it('fires onClick but not when disabled', () => {
    const onClick = vi.fn()
    const { rerender } = render(<DotMorphButton label="Go" onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
    rerender(<DotMorphButton label="Go" disabled onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
