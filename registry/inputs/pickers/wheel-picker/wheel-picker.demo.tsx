import { useState } from 'react'
import { WheelPicker } from './wheel-picker'

export default function WheelPickerDemo() {
  const [value, setValue] = useState<Record<string, string>>({ hour: '8', minute: '41', period: 'am' })
  const pad = (n: string) => n.padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-3">
      <WheelPicker label="Alarm time" value={value} onValueChange={setValue} />
      <p className="text-sm text-muted-foreground tabular-nums">
        Alarm set for {Number(value.hour) + 1}:{pad(value.minute)} {value.period?.toUpperCase()}
      </p>
    </div>
  )
}
