import { Accessibility, Braces, Keyboard, Moon, Palette, Terminal } from 'lucide-react'
import { BentoCard, BentoGrid } from './bento-grid'

const tileShades = ['bg-primary', 'bg-primary/60', 'bg-primary/25', 'bg-muted', 'bg-primary/40', 'bg-primary/80', 'bg-muted', 'bg-primary/15']

function Mosaic() {
  return (
    <div className="absolute inset-0 flex flex-wrap content-start gap-1.5 p-5">
      {Array.from({ length: 96 }, (_, i) => (
        <span
          key={i}
          style={{ transitionDelay: `${(i % 24) * 15}ms` }}
          className={`size-5 rounded-[4px] transition-transform duration-500 motion-safe:group-hover/bento:-translate-y-1 ${tileShades[(i * 5 + (i >> 3)) % tileShades.length]}`}
        />
      ))}
    </div>
  )
}

function Keycaps() {
  const key = 'flex h-9 items-center justify-center rounded-lg border border-border bg-background font-mono text-xs text-muted-foreground shadow-[0_2px_0_0] shadow-border transition-transform duration-300'
  return (
    <div className="absolute inset-x-5 top-6 grid grid-cols-3 gap-2">
      <span className={`${key} col-span-2`}>Tab</span>
      <span className={key}>Esc</span>
      <span className={key}>⇧</span>
      <span className={`${key} border-primary/50 text-primary motion-safe:group-hover/bento:translate-y-0.5 motion-safe:group-hover/bento:shadow-none`}>
        ↵
      </span>
      <span className={key}>⌥</span>
      <span className={`${key} col-span-3`}>Space</span>
      <span className={key}>←</span>
      <span className={key}>↓</span>
      <span className={key}>→</span>
    </div>
  )
}

function TerminalLines() {
  return (
    <div className="absolute inset-x-5 top-5 space-y-1.5 rounded-lg border border-border bg-background/80 p-3 font-mono text-[11px] leading-none text-muted-foreground">
      <p>
        <span className="text-primary">$</span> npx shadcn add mozaik/bento-grid
      </p>
      <p className="transition-opacity duration-500 group-hover/bento:text-foreground">✓ bento-grid.tsx</p>
    </div>
  )
}

function Wave() {
  return (
    <svg viewBox="0 0 200 60" fill="none" className="absolute inset-x-5 top-6 h-14 w-[calc(100%-2.5rem)]" preserveAspectRatio="none">
      <path
        d="M0 30 C 20 5, 40 5, 60 30 S 100 55, 120 30 S 160 5, 200 30"
        className="stroke-primary/70 transition-opacity duration-500 group-hover/bento:opacity-0"
        strokeWidth="2"
      />
      <path
        d="M0 30 H 200"
        className="stroke-foreground/40 opacity-0 transition-opacity duration-500 group-hover/bento:opacity-100"
        strokeWidth="2"
        strokeDasharray="4 6"
      />
    </svg>
  )
}

function Eclipse() {
  return (
    <div className="absolute right-6 top-3 size-16">
      <span className="absolute inset-0 rounded-full bg-primary/80 blur-[1px]" />
      <span className="absolute inset-0 translate-x-3 -translate-y-1.5 rounded-full bg-card transition-transform duration-700 ease-out motion-safe:group-hover/bento:translate-x-6" />
    </div>
  )
}

function CodeLines() {
  const line = 'h-2 rounded-full'
  return (
    <div className="absolute inset-x-5 top-6 space-y-2.5 font-mono">
      <div className="flex gap-2">
        <span className={`${line} w-12 bg-primary/70`} />
        <span className={`${line} w-24 bg-foreground/50`} />
        <span className={`${line} w-6 bg-muted-foreground/40`} />
      </div>
      <div className="flex gap-2 pl-6">
        <span className={`${line} w-16 bg-foreground/30`} />
        <span className={`${line} w-28 bg-primary/40 transition-[width] duration-500 motion-safe:group-hover/bento:w-40`} />
      </div>
      <div className="flex gap-2 pl-6">
        <span className={`${line} w-20 bg-foreground/30`} />
        <span className={`${line} w-14 bg-muted-foreground/40`} />
      </div>
      <span className={`${line} block w-4 bg-muted-foreground/40`} />
    </div>
  )
}

export default function BentoGridDemo() {
  return (
    <div className="w-full max-w-4xl">
      <BentoGrid rowHeight="11rem">
        <BentoCard
          colSpan={2}
          icon={<Palette />}
          title="Tokens, not hex"
          description="Every color comes from your theme, so blocks follow light and dark."
          visual={<Mosaic />}
          href="#"
        />
        <BentoCard
          rowSpan={2}
          icon={<Keyboard />}
          title="Keyboard first"
          description="Real links and buttons, visible focus rings, sensible tab order."
          visual={<Keycaps />}
          href="#"
          cta="Try it"
        />
        <BentoCard icon={<Terminal />} title="One command" description="Install straight into your repo." visual={<TerminalLines />} href="#" />
        <BentoCard icon={<Accessibility />} title="Reduced motion" description="Calm, static frames on request." visual={<Wave />} href="#" />
        <BentoCard icon={<Moon />} title="Dark by default" description="Tuned for dark, fine in light." visual={<Eclipse />} href="#" />
        <BentoCard
          colSpan={2}
          icon={<Braces />}
          title="Typed props"
          description="Strict TypeScript and one shared API across every component."
          visual={<CodeLines />}
          href="#"
        />
      </BentoGrid>
    </div>
  )
}
