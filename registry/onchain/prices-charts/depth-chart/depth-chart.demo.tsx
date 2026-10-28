import { DepthChart, type DepthLevel } from './depth-chart'

// A fixed ladder around 3,400, so the demo looks the same on every render.
const bids: DepthLevel[] = Array.from({ length: 14 }, (_, i) => ({ price: 3399.5 - i * 2.5, size: 3 + ((i * 7) % 5) * 2 + i * 0.8 }))
const asks: DepthLevel[] = Array.from({ length: 14 }, (_, i) => ({ price: 3400.5 + i * 2.5, size: 2.5 + ((i * 5) % 6) * 2 + i * 0.7 }))

export default function DepthChartDemo() {
  return (
    <div className="w-[min(94vw,640px)] rounded-2xl border border-border bg-card p-5 text-card-foreground">
      <p className="mb-3 text-sm font-medium">
        ETH / USDC <span className="text-muted-foreground">· depth</span>
      </p>
      <DepthChart bids={bids} asks={asks} label="ETH/USDC depth" formatPrice={(v) => v.toFixed(1)} />
    </div>
  )
}
