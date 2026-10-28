import { useState } from 'react'
import { AudioEqualizer } from './audio-equalizer'

export default function AudioEqualizerDemo() {
  const [playing, setPlaying] = useState(true)
  return (
    <div className="flex items-center gap-6">
      <AudioEqualizer playing={playing} bars={7} size={40} label="Now playing" />
      <AudioEqualizer playing={playing} bars={4} size={20} className="text-muted-foreground" />
      <button
        type="button"
        aria-pressed={playing}
        onClick={() => setPlaying((p) => !p)}
        className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {playing ? 'Pause' : 'Play'}
      </button>
    </div>
  )
}
