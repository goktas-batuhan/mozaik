import { LiquidityHeatmap } from './liquidity-heatmap'

const ROWS = 18
const COLS = 36

// Liquidity clusters around a few walls; a seeded wobble keeps every render the same.
const cells = Array.from({ length: ROWS }, (_, r) =>
  Array.from({ length: COLS }, (_, c) => {
    const wallA = Math.exp(-((r - 5) ** 2) / 1.5)
    const wallB = Math.exp(-((r - 13) ** 2) / 2.5)
    const drift = 0.5 + 0.5 * Math.sin(c / 5 + r)
    return (wallA * 9 + wallB * 6 + 1) * (0.5 + drift * 0.5) * 1e5
  }),
)
const rowLabels = Array.from({ length: ROWS }, (_, r) => (3440 - r * 5).toLocaleString('en-US'))
const columnLabels = Array.from({ length: COLS }, (_, c) => {
  const m = 9 * 60 + c * 5
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
})

export default function LiquidityHeatmapDemo() {
  return (
    <div className="w-[min(94vw,640px)] rounded-2xl border border-border bg-card p-5 text-card-foreground">
      <p className="mb-3 text-sm font-medium">
        ETH / USDC <span className="text-muted-foreground">· resting liquidity</span>
      </p>
      <LiquidityHeatmap cells={cells} rowLabels={rowLabels} columnLabels={columnLabels} markerRow={9} label="ETH/USDC liquidity" />
    </div>
  )
}
