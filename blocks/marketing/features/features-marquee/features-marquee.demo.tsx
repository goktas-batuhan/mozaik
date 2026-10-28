import type { ReactNode } from 'react'
import { FeaturesMarquee } from './features-marquee'

const Icon = ({ d }: { d: string }): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const features = [
  { title: 'Version history', description: 'Restore any earlier state.', icon: <Icon d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5m4-1v5l3 2" /> },
  { title: 'Granular roles', description: 'Control who sees what.', icon: <Icon d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" /> },
  { title: 'Webhooks', description: 'Push events anywhere.', icon: <Icon d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /> },
  { title: 'Dark mode', description: 'Follows the system theme.', icon: <Icon d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" /> },
  { title: 'Keyboard first', description: 'Every action has a shortcut.', icon: <Icon d="M3 7h18v10H3zM7 11h.01M11 11h.01M15 11h.01M8 14h8" /> },
  { title: 'Offline mode', description: 'Keep working without a signal.', icon: <Icon d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01" /> },
  { title: 'Audit logs', description: 'A record of every change.', icon: <Icon d="M9 12h6M9 16h6M7 3h7l5 5v13H7zM14 3v5h5" /> },
  { title: 'CSV export', description: 'Take your data with you.', icon: <Icon d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" /> },
]

export default function FeaturesMarqueeDemo() {
  return (
    <div className="w-full max-w-5xl">
      <FeaturesMarquee
        title="And a long list of small things"
        description="The details that make a product feel finished."
        features={features}
      />
    </div>
  )
}
