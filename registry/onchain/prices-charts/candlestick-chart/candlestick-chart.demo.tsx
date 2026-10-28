import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { CandlestickChart, type Candle } from './candlestick-chart'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const usd = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

// A small seeded walk so the demo is the same on every render.
function makeCandles(count: number): Candle[] {
  let seed = 7
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  let price = 3380
  return Array.from({ length: count }, (_, i) => {
    const open = price
    const close = open * (1 + (rand() - 0.47) * 0.012)
    const high = Math.max(open, close) * (1 + rand() * 0.004)
    const low = Math.min(open, close) * (1 - rand() * 0.004)
    price = close
    const minutes = 9 * 60 + i * 5
    return {
      id: `c${i}`,
      label: `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`,
      open,
      high,
      low,
      close,
      volume: 400 + rand() * 1600,
    }
  })
}

const START = makeCandles(48)

export default function CandlestickChartDemo() {
  const reduced = usePrefersReducedMotion()
  const [candles, setCandles] = useState(START)

  // The newest candle keeps trading; nothing moves under reduced motion.
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => {
      setCandles((list) => {
        const last = list[list.length - 1]
        const close = last.close * (1 + (Math.random() - 0.5) * 0.003)
        return [
          ...list.slice(0, -1),
          { ...last, close, high: Math.max(last.high, close), low: Math.min(last.low, close), volume: last.volume + Math.random() * 40 },
        ]
      })
    }, 1600)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <div className="w-[min(94vw,720px)] rounded-2xl border border-border bg-card p-5 text-card-foreground">
      <p className="mb-3 text-sm font-medium">
        ETH / USD <span className="text-muted-foreground">· 5m</span>
      </p>
      <CandlestickChart candles={candles} lastPrice={candles[candles.length - 1].close} formatPrice={usd} label="ETH/USD 5 minute candles" height={300} />
    </div>
  )
}
