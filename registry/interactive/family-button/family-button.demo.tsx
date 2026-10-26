import { Mail, Send, Share2, Star } from 'lucide-react'
import { FamilyButton } from './family-button'

const actions = [
  { icon: Send, label: 'Send' },
  { icon: Share2, label: 'Share' },
  { icon: Star, label: 'Save' },
  { icon: Mail, label: 'Email' },
]

export default function FamilyButtonDemo() {
  return (
    <div className="grid h-[320px] place-items-center">
      <FamilyButton label="Quick actions">
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">Quick actions</p>
        <ul className="grid grid-cols-2 gap-2">
          {actions.map(({ icon: Icon, label }) => (
            <li key={label}>
              <button
                type="button"
                className="flex w-full flex-col items-center gap-1.5 rounded-xl border border-border bg-background/50 py-3 text-xs outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </FamilyButton>
    </div>
  )
}
