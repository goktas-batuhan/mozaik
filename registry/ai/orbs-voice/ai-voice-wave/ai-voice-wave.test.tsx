import { render, screen } from '@testing-library/react'
import { AIVoiceWave } from './ai-voice-wave'

describe('AIVoiceWave', () => {
  it('is an image with a state in its label', () => {
    const { rerender } = render(<AIVoiceWave />)
    expect(screen.getByRole('img', { name: 'Voice: idle' })).toBeInTheDocument()
    rerender(<AIVoiceWave active label="Mic" />)
    expect(screen.getByRole('img', { name: 'Mic: listening' })).toBeInTheDocument()
  })

  it('draws one bar per level when levels are given', () => {
    const { container } = render(<AIVoiceWave levels={[0.1, 0.5, 1]} />)
    expect(container.querySelectorAll('[data-slot="ai-voice-wave"] > span')).toHaveLength(3)
  })

  it('draws the requested number of bars otherwise', () => {
    const { container } = render(<AIVoiceWave bars={12} />)
    expect(container.querySelectorAll('[data-slot="ai-voice-wave"] > span')).toHaveLength(12)
  })

  it('sets its height and marks the state', () => {
    render(<AIVoiceWave height={64} active />)
    const wave = screen.getByRole('img')
    expect(wave).toHaveStyle({ height: '64px' })
    expect(wave).toHaveAttribute('data-active', 'true')
  })
})
