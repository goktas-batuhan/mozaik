import { PriceTargetFan } from './price-target-fan'

const HISTORY = [112, 115, 111, 118, 124, 121, 127, 133, 129, 136, 141, 138, 146, 152, 149, 155, 161, 158, 166, 171]

export default function PriceTargetFanDemo() {
  return (
    <div className="w-[min(94vw,640px)] rounded-2xl border border-border bg-card p-5 text-card-foreground">
      <p className="mb-3 text-sm font-medium">
        ACME <span className="text-muted-foreground">· 24 analysts</span>
      </p>
      <PriceTargetFan history={HISTORY} targets={{ low: 140, avg: 188, high: 232 }} label="ACME price targets" />
    </div>
  )
}
