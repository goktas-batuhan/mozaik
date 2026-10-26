import { ShiftCard } from './shift-card'

export default function ShiftCardDemo() {
  return (
    <ShiftCard
      topContent={
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">Pro plan</span>
          <span className="text-xs text-muted-foreground">Renews May 4</span>
        </div>
      }
      topRevealContent={<p className="mt-3 text-xl font-semibold tracking-tight">Usage this month</p>}
      middleContent={
        <div className="text-center">
          <p className="text-5xl font-semibold tracking-tight">$24</p>
          <p className="mt-1 text-muted-foreground">per month</p>
        </div>
      }
      bottomContent={
        <div className="space-y-2">
          <p className="font-medium">Billing details</p>
          <dl className="space-y-1.5 text-muted-foreground">
            {[
              ['Seats', '4 of 5 used'],
              ['Storage', '38 GB of 100 GB'],
              ['API calls', '12.4k of 50k'],
              ['Next invoice', 'May 4, 2026'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <dt>{k}</dt>
                <dd className="text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      }
    />
  )
}
