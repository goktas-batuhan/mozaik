import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { AudioEqualizer } from './audio-equalizer'

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)

describe('AudioEqualizer', () => {
  it('is one labelled image with the requested number of bars', () => {
    const { container } = still(<AudioEqualizer bars={6} label="Now playing" />)
    expect(screen.getByRole('img', { name: 'Now playing' })).toBeInTheDocument()
    expect(container.querySelectorAll('[data-bar]')).toHaveLength(6)
  })

  it('always draws at least one bar', () => {
    const { container } = still(<AudioEqualizer bars={0} />)
    expect(container.querySelectorAll('[data-bar]')).toHaveLength(1)
  })

  it('holds still under reduced motion even while playing', () => {
    still(<AudioEqualizer playing />)
    expect(screen.getByRole('img')).toHaveAttribute('data-playing', 'false')
  })

  it('animates when playing and motion is allowed', () => {
    const { rerender } = render(<AudioEqualizer playing />)
    expect(screen.getByRole('img')).toHaveAttribute('data-playing', 'true')
    rerender(<AudioEqualizer playing={false} />)
    expect(screen.getByRole('img')).toHaveAttribute('data-playing', 'false')
  })

  it('sets the height from size', () => {
    still(<AudioEqualizer size={50} />)
    expect(screen.getByRole('img').style.height).toBe('50px')
  })
})
