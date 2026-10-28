import { useState } from 'react'
import { WeekStripCalendar } from './week-strip-calendar'

export default function WeekStripCalendarDemo() {
  const [date, setDate] = useState<Date>(() => new Date())
  return (
    <div className="flex flex-col items-center gap-4">
      <WeekStripCalendar value={date} onChange={setDate} />
      <p className="text-sm text-muted-foreground">
        Selected:{' '}
        <span className="text-foreground">
          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </p>
    </div>
  )
}
