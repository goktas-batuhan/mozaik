import { useState } from 'react'
import { Scrubber } from './scrubber'

export default function ScrubberDemo() {
  const [opacity, setOpacity] = useState(0.62)
  return (
    <div className="flex w-72 flex-col gap-4">
      <Scrubber label="Opacity" value={opacity} onValueChange={setOpacity} />
      <Scrubber label="Blur" min={0} max={40} step={1} decimals={0} defaultValue={12} ticks={7} />
      <Scrubber label="Speed" min={0.5} max={2} step={0.05} defaultValue={1} ticks={0} />
    </div>
  )
}
