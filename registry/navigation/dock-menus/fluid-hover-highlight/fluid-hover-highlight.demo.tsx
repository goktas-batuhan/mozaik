import { useRef } from 'react'
import { FluidHoverHighlight, useFluidHover } from './fluid-hover-highlight'

const ROWS = ['Overview', 'Activity', 'Members', 'Billing', 'Settings']

export default function FluidHoverHighlightDemo() {
  const ref = useRef<HTMLUListElement>(null)
  const hover = useFluidHover(ref)

  return (
    <ul
      ref={ref}
      aria-label="Workspace sections"
      className="relative w-64 rounded-xl border border-border bg-card p-1.5"
      {...hover.containerProps}
    >
      <FluidHoverHighlight rect={hover.rect} session={hover.session} className="rounded-lg" />
      {ROWS.map((label, index) => (
        <li key={label}>
          <button
            type="button"
            {...hover.getItemProps(index)}
            className="relative flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm text-card-foreground outline-none focus-visible:outline-2 focus-visible:outline-ring"
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  )
}
