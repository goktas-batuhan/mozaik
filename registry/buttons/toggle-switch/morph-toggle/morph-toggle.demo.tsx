import { useState } from 'react'
import { MorphToggle, type MorphToggleProps } from './morph-toggle'

const Sun = (
  <svg viewBox="0 0 24 24" className="size-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)
const Moon = (
  <svg viewBox="0 0 24 24" className="size-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
  </svg>
)

export default function MorphToggleDemo() {
  const [on, setOn] = useState(true)
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-6">
        <MorphToggle label="Default" defaultChecked />
        <MorphToggle label="Morph" variant="morph" size="lg" />
        <MorphToggle label="Theme" variant="icon" icons={{ on: Moon, off: Sun }} size="lg" checked={on} onChange={setOn} />
        <MorphToggle label="Disabled" size="sm" disabled />
      </div>
      <p className="text-sm text-muted-foreground">Theme switch is {on ? 'on' : 'off'}.</p>
    </div>
  )
}

export function VariantPreview(props: MorphToggleProps) {
  return <MorphToggle label="Toggle" {...props} icons={props.icons ?? { on: Moon, off: Sun }} />
}
