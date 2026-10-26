import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { PriceTicker } from './price-ticker'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


interface Market {
  symbol: string
  name: string
  open: number
  price: number
  decimals: number
}

const START: Market[] = [
  { symbol: 'ETH', name: 'Ether', open: 3412.18, price: 3468.42, decimals: 2 },
  { symbol: 'BTC', name: 'Bitcoin', open: 98240.5, price: 97615.3, decimals: 2 },
  { symbol: 'SOL', name: 'Solana', open: 182.44, price: 186.91, decimals: 2 },
  { symbol: 'ARB', name: 'Arbitrum', open: 0.8421, price: 0.8377, decimals: 4 },
]

// A small random walk so the demo keeps ticking.
const step = (m: Market): Market => {
  const drift = (Math.random() - 0.48) * 0.006
  const price = Number((m.price * (1 + drift)).toFixed(m.decimals))
  return { ...m, price }
}

export default function PriceTickerDemo() {
  const reduced = usePrefersReducedMotion()
  const [markets, setMarkets] = useState(START)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => {
      setMarkets((list) => list.map((m, i) => (i === 0 || Math.random() > 0.45 ? step(m) : m)))
    }, 2200)
    return () => clearInterval(id)
  }, [reduced])

  const [lead, ...rest] = markets

  return (
    <div className="w-[min(92vw,560px)] rounded-2xl border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {lead.symbol}
          <span className="text-muted-foreground"> / USD</span>
        </span>
        <span>24h change</span>
      </div>
      <PriceTicker
        value={lead.price}
        previousValue={lead.open}
        currency="USD"
        label={`${lead.name} price`}
        className="mt-3 text-5xl font-semibold tracking-tight"
      />

      <ul className="mt-6 divide-y border-t">
        {rest.map((m) => (
          <li key={m.symbol} className="flex items-center justify-between py-3">
            <span className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-muted font-mono text-[11px] font-semibold">
                {m.symbol}
              </span>
              <span className="text-sm font-medium">{m.name}</span>
            </span>
            <PriceTicker
              value={m.price}
              previousValue={m.open}
              currency="USD"
              decimals={m.decimals}
              label={`${m.name} price`}
              className="text-base font-medium"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
