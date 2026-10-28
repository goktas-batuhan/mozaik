import { useState } from 'react'
import { BounceSidebar } from './bounce-sidebar'

const items = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'activity', label: 'Activity' },
  { id: 'team', label: 'Team' },
  { id: 'settings', label: 'Settings' },
]

export default function BounceSidebarDemo() {
  const [value, setValue] = useState('overview')
  return (
    <div className="w-56 rounded-xl border border-border bg-card p-3 text-card-foreground">
      <BounceSidebar items={items} value={value} onValueChange={setValue} />
    </div>
  )
}
