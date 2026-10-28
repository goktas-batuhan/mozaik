import { useState } from 'react'
import { DimpleSwitch } from './dimple-switch'

export default function DimpleSwitchDemo() {
  const [on, setOn] = useState(true)
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <DimpleSwitch label="Notifications" checked={on} onCheckedChange={setOn} />
        <span className="w-28 text-sm text-muted-foreground">
          Notifications <span className="text-foreground">{on ? 'on' : 'off'}</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <DimpleSwitch label="Disabled option" disabled />
        <span className="text-sm text-muted-foreground">Disabled</span>
      </div>
    </div>
  )
}
