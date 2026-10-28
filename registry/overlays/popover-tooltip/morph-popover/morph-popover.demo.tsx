import { MorphPopover } from './morph-popover'

const chat = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

export default function MorphPopoverDemo() {
  return (
    <div className="h-56 w-[min(92vw,380px)] pt-2">
      <MorphPopover label="Send feedback" icon={chat} />
    </div>
  )
}
