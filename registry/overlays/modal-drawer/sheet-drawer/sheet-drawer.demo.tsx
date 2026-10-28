import { useState } from 'react'
import { SheetDrawer, type SheetDrawerSide } from './sheet-drawer'

const button = 'cursor-pointer rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

export default function SheetDrawerDemo() {
  const [side, setSide] = useState<SheetDrawerSide | null>(null)
  const filters = ['Only unread', 'Has attachments', 'From teammates', 'Starred']
  return (
    <>
      <div className="flex gap-3">
        <button type="button" className={button} onClick={() => setSide('right')}>
          Open from right
        </button>
        <button type="button" className={button} onClick={() => setSide('bottom')}>
          Open from bottom
        </button>
      </div>
      <SheetDrawer
        open={side !== null}
        onOpenChange={(o) => !o && setSide(null)}
        side={side ?? 'right'}
        title="Filters"
        description="Narrow down what shows in your inbox."
        footer={
          <button type="button" onClick={() => setSide(null)} className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            Apply
          </button>
        }
      >
        <ul className="flex flex-col gap-3">
          {filters.map((f) => (
            <li key={f}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
                <input type="checkbox" className="size-4 accent-primary" />
                {f}
              </label>
            </li>
          ))}
        </ul>
      </SheetDrawer>
    </>
  )
}
