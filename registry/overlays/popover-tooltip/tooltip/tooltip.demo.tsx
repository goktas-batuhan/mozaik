import { Tooltip } from './tooltip'

const button = 'inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

function Icon({ d }: { d: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

export default function TooltipDemo() {
  return (
    <div className="flex items-center gap-4 py-10">
      <Tooltip content="Copy link" side="top">
        <button type="button" aria-label="Copy link" className={button}>
          <Icon d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1" />
        </button>
      </Tooltip>
      <Tooltip content="Bookmark this page" side="bottom">
        <button type="button" aria-label="Bookmark" className={button}>
          <Icon d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </button>
      </Tooltip>
      <Tooltip content="Share" side="right">
        <button type="button" aria-label="Share" className={button}>
          <Icon d="M4 12v8h16v-8M16 6l-4-4-4 4M12 2v13" />
        </button>
      </Tooltip>
    </div>
  )
}
