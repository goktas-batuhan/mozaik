import { useState } from 'react'
import { AIVoiceWave } from './ai-voice-wave'

const LEVELS = [0.2, 0.35, 0.6, 0.9, 0.7, 0.45, 0.8, 1, 0.65, 0.4, 0.55, 0.3, 0.15]

export default function AIVoiceWaveDemo() {
  const [active, setActive] = useState(true)

  return (
    <div className="flex w-[min(92vw,360px)] flex-col items-center gap-5">
      <AIVoiceWave active={active} bars={28} />
      <AIVoiceWave levels={LEVELS} active height={40} label="Microphone" />
      <button
        type="button"
        aria-pressed={active}
        onClick={() => setActive((a) => !a)}
        className="h-8 cursor-pointer rounded-full border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {active ? 'Stop listening' : 'Start listening'}
      </button>
    </div>
  )
}
