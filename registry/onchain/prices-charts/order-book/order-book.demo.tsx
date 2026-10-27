import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { OrderBook, type OrderBookLevel, type OrderBookProps } from './order-book'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const MID = 3468.4
const ladder = (side: 1 | -1, seed: number): OrderBookLevel[] =>
  Array.from({ length: 8 }, (_, i) => ({
    price: Number((MID + side * (0.5 + i * 0.75)).toFixed(2)),
    size: Number((1.2 + ((i * 7 + seed) % 9) * 0.9).toFixed(3)),
  }))

export default function OrderBookDemo() {
  const reduced = usePrefersReducedMotion()
  const [book, setBook] = useState(() => ({ bids: ladder(-1, 1), asks: ladder(1, 4) }))

  // Simulated feed: a few sizes change every second. It stops under reduced motion.
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => {
      setBook((b) => {
        const bump = (levels: OrderBookLevel[]) =>
          levels.map((l) => (Math.random() > 0.6 ? { ...l, size: Number(Math.max(0.2, l.size + (Math.random() - 0.5) * 2).toFixed(3)) } : l))
        return { bids: bump(b.bids), asks: bump(b.asks) }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <div className="w-[min(92vw,460px)]">
      <OrderBook bids={book.bids} asks={book.asks} levels={6} baseSymbol="ETH" quoteSymbol="USDC" lastPrice={MID} />
    </div>
  )
}

export function VariantPreview(props: OrderBookProps) {
  return (
    <div className="w-[min(92vw,460px)]">
      <OrderBook {...props} />
    </div>
  )
}
