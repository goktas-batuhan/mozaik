import { useState } from 'react'
import { PredictionMarketBar, type MarketSide } from './prediction-market-bar'

export default function PredictionMarketBarDemo() {
  const [last, setLast] = useState<MarketSide | null>(null)
  return (
    <div className="flex w-[min(94vw,420px)] flex-col gap-3">
      <PredictionMarketBar question="Will ETH close above $4,000 on Dec 31?" yes={0.62} volume="$1.2M" closes="Closes Dec 31" onTrade={setLast} />
      <p className="text-center text-xs text-muted-foreground" aria-live="polite">
        {last ? `You picked ${last === 'yes' ? 'Yes' : 'No'} (demo, nothing is sent)` : 'Pick a side'}
      </p>
    </div>
  )
}
