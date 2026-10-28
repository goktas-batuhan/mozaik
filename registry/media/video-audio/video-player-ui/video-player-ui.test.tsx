import { act, fireEvent, render, screen } from '@testing-library/react'
import { VideoPlayerUI } from './video-player-ui'

afterEach(() => vi.useRealTimers())

describe('VideoPlayerUI', () => {
  it('starts paused with a big play button and the poster', () => {
    render(<VideoPlayerUI duration={60}><p>Poster</p></VideoPlayerUI>)
    expect(screen.getByText('Poster')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Play' })).toHaveLength(2)
  })

  it('plays, hides the big button and ticks forward', () => {
    vi.useFakeTimers()
    render(<VideoPlayerUI duration={60} />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Play' })[0])
    expect(screen.getAllByRole('button', { name: 'Pause' })).toHaveLength(1)
    act(() => void vi.advanceTimersByTime(3000))
    expect(screen.getByRole('slider', { name: 'Seek' })).toHaveAttribute('aria-valuetext', '0:03 of 1:00')
  })

  it('cycles the playback speed and plays faster', () => {
    vi.useFakeTimers()
    render(<VideoPlayerUI duration={60} defaultPlaying />)
    fireEvent.click(screen.getByRole('button', { name: 'Playback speed 1x' }))
    fireEvent.click(screen.getByRole('button', { name: 'Playback speed 1.5x' }))
    expect(screen.getByRole('button', { name: 'Playback speed 2x' })).toBeInTheDocument()
    act(() => void vi.advanceTimersByTime(2000))
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '0:04 of 1:00')
  })

  it('seeks and calls onFullscreen', () => {
    const onFullscreen = vi.fn()
    render(<VideoPlayerUI duration={100} onFullscreen={onFullscreen} />)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '70' } })
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '1:10 of 1:40')
    fireEvent.click(screen.getByRole('button', { name: 'Fullscreen' }))
    expect(onFullscreen).toHaveBeenCalledTimes(1)
  })
})
