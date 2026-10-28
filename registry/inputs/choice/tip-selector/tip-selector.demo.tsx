import { useState } from 'react'
import { TipSelector } from './tip-selector'

export default function TipSelectorDemo() {
  const [tip, setTip] = useState(0)
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <TipSelector
        subtotal={42.6}
        recipient={{ name: 'Sam', note: 'Your courier · 6 min early' }}
        onChange={(amount) => setTip(amount)}
      />
      <p className="text-xs text-muted-foreground">
        Last tip reported by <code className="text-foreground">onChange</code>:{' '}
        <span className="text-foreground tabular-nums">{tip ? `$${tip.toFixed(2)}` : 'none yet'}</span>
      </p>
    </div>
  )
}
