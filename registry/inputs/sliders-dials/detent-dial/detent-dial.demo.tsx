import { useState } from 'react'
import { DetentDial } from './detent-dial'

export default function DetentDialDemo() {
  const [temp, setTemp] = useState(21)
  return (
    <div className="flex flex-col items-center gap-2">
      <DetentDial label="Temperature" min={16} max={30} step={0.5} value={temp} onValueChange={setTemp} />
      <p className="text-xs text-muted-foreground">Drag, flick, scroll while focused, or use the arrow keys. Double-click resets.</p>
    </div>
  )
}
