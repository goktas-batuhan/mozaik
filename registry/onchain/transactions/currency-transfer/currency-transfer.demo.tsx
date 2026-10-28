import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CurrencyTransfer, type TransferStatus } from './currency-transfer'

const FROM = { amount: 1000, currency: 'USD', symbol: '$', bank: 'Kraken', last4: '2041' }
const TO = { amount: 921.4, currency: 'EUR', symbol: '€', bank: 'Bitstamp', last4: '7783', name: 'Lena Fischer' }

const OPTIONS: { value: TransferStatus | 'auto'; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'completed', label: 'Arrived' },
  { value: 'failed', label: 'Failed' },
]

export default function CurrencyTransferDemo() {
  const [mode, setMode] = useState<TransferStatus | 'auto'>('auto')
  const [run, setRun] = useState(0)

  return (
    <div className="flex w-[min(92vw,384px)] flex-col items-center gap-4">
      <div role="group" aria-label="Transfer status" className="inline-flex rounded-full bg-muted p-1 text-xs font-medium">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={mode === option.value}
            onClick={() => {
              setMode(option.value)
              setRun((n) => n + 1)
            }}
            className={cn(
              'rounded-full px-3 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring',
              mode === option.value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <CurrencyTransfer
        key={run}
        from={FROM}
        to={TO}
        rate={0.9214}
        txnId="TXN-8F2K91QX"
        timestamp="10:45 AM"
        status={mode === 'auto' ? undefined : mode}
        onRetry={() => {
          setMode('auto')
          setRun((n) => n + 1)
        }}
      />
    </div>
  )
}
