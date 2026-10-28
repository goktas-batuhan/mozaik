import { useState } from 'react'
import { AmountStepper } from './amount-stepper'

export default function AmountStepperDemo() {
  const [amount, setAmount] = useState(0.5)
  const [gwei, setGwei] = useState(12)
  return (
    <div className="flex w-[min(92vw,380px)] flex-col gap-5 rounded-2xl border border-border bg-card p-6 text-card-foreground">
      <div className="flex items-center justify-between gap-4">
        <div className="leading-tight">
          <p className="text-sm font-medium">Stake</p>
          <p className="text-xs text-muted-foreground">Balance 3.25 ETH</p>
        </div>
        <AmountStepper label="Amount to stake" value={amount} onChange={setAmount} step={0.25} min={0} max={3.25} unit="ETH" decimals={2} />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="leading-tight">
          <p className="text-sm font-medium">Max fee</p>
          <p className="text-xs text-muted-foreground">Priority fee cap</p>
        </div>
        <AmountStepper label="Max fee" value={gwei} onChange={setGwei} step={1} min={1} max={60} unit="gwei" />
      </div>
    </div>
  )
}
