// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/features/features-3/index.tsx
import { FeaturesAlternating } from './features-alternating'

function Art({ variant }: { variant: 1 | 2 | 3 }) {
  return (
    <div aria-hidden className="relative aspect-video w-full bg-linear-to-br from-primary/20 via-muted to-background">
      <svg viewBox="0 0 320 180" className="absolute inset-0 size-full" fill="none">
        {variant === 1 && (
          <>
            <circle cx="160" cy="90" r="48" className="stroke-primary" strokeWidth="2" />
            <circle cx="160" cy="90" r="24" className="fill-primary/30" />
            <path d="M40 140h240" className="stroke-border" strokeWidth="2" />
          </>
        )}
        {variant === 2 && (
          <>
            {[60, 100, 140, 180, 220, 260].map((x, i) => (
              <rect key={x} x={x - 12} y={140 - (i + 1) * 16} width="24" height={(i + 1) * 16} rx="4" className={i === 5 ? 'fill-primary' : 'fill-primary/25'} />
            ))}
          </>
        )}
        {variant === 3 && (
          <>
            <rect x="60" y="40" width="200" height="100" rx="10" className="stroke-primary" strokeWidth="2" />
            <path d="M80 70h90M80 90h130M80 110h60" className="stroke-muted-foreground/50" strokeWidth="4" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  )
}

export default function FeaturesAlternatingDemo() {
  return (
    <div className="w-full max-w-5xl">
      <FeaturesAlternating
        title="Why teams choose us"
        description="Designed for productivity, built to last."
        features={[
          { title: 'Intuitive by design', description: 'Every screen is made for the first minute of use, so nobody needs a tour.', media: <Art variant={1} />, link: { label: 'Read the design notes', href: '#' } },
          { title: 'Fast where it counts', description: 'Only transform and opacity animate, so interfaces stay smooth on modest hardware.', media: <Art variant={2} /> },
          { title: 'A joy for developers', description: 'Typed props, copy-paste installs and docs that stay out of your way.', media: <Art variant={3} />, link: { label: 'Browse the docs', href: '#' } },
        ]}
      />
    </div>
  )
}
