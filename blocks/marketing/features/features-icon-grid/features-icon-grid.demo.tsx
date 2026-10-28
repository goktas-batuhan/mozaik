// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/features/features-1/index.tsx
import type { ReactNode } from 'react'
import { FeaturesIconGrid } from './features-icon-grid'

const Icon = ({ d }: { d: string }): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const features = [
  { title: 'Lightning fast', description: 'Optimized for performance with a tiny bundle and efficient rendering.', icon: <Icon d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /> },
  { title: 'Accessible', description: 'ARIA attributes, keyboard navigation and reduced motion support built in.', icon: <Icon d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 5v5m0 3v.01" /> },
  { title: 'Customizable', description: 'Tailwind classes and design tokens let you restyle anything in minutes.', icon: <Icon d="M4 7h10m4 0h2M4 17h2m4 0h10M14 4v6m-4 4v6" /> },
  { title: 'TypeScript first', description: 'Exported types for every prop, so your editor does the documenting.', icon: <Icon d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /> },
  { title: 'Smooth motion', description: 'Spring animations with sensible defaults and a calm reduced-motion mode.', icon: <Icon d="M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M18 6l-2.5 2.5m-7 7L6 18" /> },
  { title: 'Open source', description: 'Copy the source into your project with one command and own every line.', icon: <Icon d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /> },
]

export default function FeaturesIconGridDemo() {
  return (
    <div className="w-full max-w-5xl">
      <FeaturesIconGrid
        eyebrow="Features"
        title="Everything you need to build"
        description="Production-ready pieces with motion, accessibility and types included."
        features={features}
      />
    </div>
  )
}
