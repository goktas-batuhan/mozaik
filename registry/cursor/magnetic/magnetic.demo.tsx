import { ArrowUpRight, GitBranch, Mail, Send } from 'lucide-react'
import { Magnetic } from './magnetic'

const icons = [
  { label: 'Source', Icon: GitBranch },
  { label: 'Email', Icon: Mail },
  { label: 'Message', Icon: Send },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring'

export default function MagneticDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-12 text-center">
      <div className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Move your cursor close</p>
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Have a project in mind?</h2>
      </div>

      <Magnetic strength={0.3} radius={80}>
        <a
          href="#"
          className={`group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/35 ${focusRing}`}
        >
          Start a conversation
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </a>
      </Magnetic>

      <div className="flex items-center gap-4">
        {icons.map(({ label, Icon }) => (
          <Magnetic key={label} strength={0.5} radius={40}>
            <a
              href="#"
              aria-label={label}
              className={`grid size-12 place-items-center rounded-full border bg-card text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground ${focusRing}`}
            >
              <Icon className="size-5" aria-hidden />
            </a>
          </Magnetic>
        ))}
      </div>
    </div>
  )
}
