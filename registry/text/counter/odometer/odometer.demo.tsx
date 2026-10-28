import { useState } from 'react'
import { Odometer } from './odometer'

export default function OdometerDemo() {
  const [value, setValue] = useState(12840)

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <Odometer value={value} className="text-7xl font-semibold tracking-tight" />
      <Odometer
        value={value / 100}
        format={{ style: 'currency', currency: 'USD' }}
        className="text-2xl text-muted-foreground"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setValue((v) => v + 1284)}
          className="cursor-pointer rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Add 1,284
        </button>
        <button
          type="button"
          onClick={() => setValue(12840)}
          className="cursor-pointer rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
