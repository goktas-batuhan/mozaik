import type { ReactNode } from 'react'
import { FeaturesHoverExpand } from './features-hover-expand'

const Icon = ({ d }: { d: string }): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const Glow = ({ x }: { x: string }) => (
  <div className="size-full" style={{ background: `radial-gradient(circle at ${x} 100%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 65%)` }} />
)

export default function FeaturesHoverExpandDemo() {
  return (
    <div className="w-full max-w-5xl">
      <FeaturesHoverExpand
        title="Hover to explore"
        description="Four pillars, one calm interface."
        panels={[
          { id: 'speed', title: 'Speed', icon: <Icon d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />, description: 'Pages render in a blink and interactions never wait on the network.', visual: <Glow x="10%" /> },
          { id: 'safety', title: 'Safety', icon: <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, description: 'Encryption, backups and access reviews run quietly in the background.', visual: <Glow x="40%" /> },
          { id: 'scale', title: 'Scale', icon: <Icon d="M4 20V10m6 10V4m6 16v-7m4 7H2" />, description: 'From ten users to ten million, with no re-architecture in between.', visual: <Glow x="70%" /> },
          { id: 'support', title: 'Support', icon: <Icon d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12z" />, description: 'Real people answer within the hour, every day of the week.', visual: <Glow x="95%" /> },
        ]}
      />
    </div>
  )
}
