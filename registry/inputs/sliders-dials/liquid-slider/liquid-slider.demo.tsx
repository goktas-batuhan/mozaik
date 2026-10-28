import { useState } from 'react'
import { LiquidSlider } from './liquid-slider'

export default function LiquidSliderDemo() {
  const [ml, setMl] = useState(1250)
  return (
    <div className="flex flex-col items-center gap-3">
      <LiquidSlider value={ml} onValueChange={setMl} label="Water today" unit="ml" />
      <p className="text-xs text-muted-foreground">Drag the surface, or use the arrow keys.</p>
    </div>
  )
}
