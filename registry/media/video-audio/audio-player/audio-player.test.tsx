import { act, fireEvent, render, screen } from '@testing-library/react'
import { AudioPlayer } from './audio-player'

afterEach(() => vi.useRealTimers())

describe('AudioPlayer', () => {
  it('shows the track and a paused play button', () => {
    render(<AudioPlayer title="Blue Hour" artist="Ada" duration={90} />)
    expect(screen.getByText('Blue Hour')).toBeInTheDocument()
    expect(screen.getByText('Ada')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Seek Blue Hour' })).toHaveAttribute('aria-valuetext', '0:00 of 1:30')
  })

  it('advances while playing and pauses at the end', () => {
    vi.useFakeTimers()
    const onPlayingChange = vi.fn()
    render(<AudioPlayer title="T" duration={3} onPlayingChange={onPlayingChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Play' }))
    act(() => void vi.advanceTimersByTime(2000))
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '0:02 of 0:03')
    act(() => void vi.advanceTimersByTime(1500))
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    expect(onPlayingChange).toHaveBeenLastCalledWith(false)
  })

  it('seeks with the slider and reports the time', () => {
    const onTimeChange = vi.fn()
    render(<AudioPlayer title="T" duration={100} onTimeChange={onTimeChange} />)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '42' } })
    expect(onTimeChange).toHaveBeenCalledWith(42)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '0:42 of 1:40')
  })

  it('toggles mute', () => {
    render(<AudioPlayer title="T" duration={10} />)
    fireEvent.click(screen.getByRole('button', { name: 'Mute' }))
    expect(screen.getByRole('button', { name: 'Unmute' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('stays put when controlled', () => {
    render(<AudioPlayer title="T" duration={100} currentTime={10} playing={false} />)
    fireEvent.click(screen.getByRole('button', { name: 'Play' }))
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '0:10 of 1:40')
  })
})
