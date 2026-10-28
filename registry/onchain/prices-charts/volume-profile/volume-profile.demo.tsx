import { VolumeProfile, type VolumeProfileBin } from './volume-profile'

const usd = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

// 20 price bins of $10 with a bell-shaped volume around $3,420 and a second small shelf near $3,360.
const DATA: VolumeProfileBin[] = Array.from({ length: 20 }, (_, i) => {
  const priceLow = 3300 + i * 10
  const mid = priceLow + 5
  const main = 1800 * Math.exp(-((mid - 3420) ** 2) / (2 * 38 ** 2))
  const shelf = 520 * Math.exp(-((mid - 3360) ** 2) / (2 * 12 ** 2))
  // A fixed wobble keeps the shape from looking synthetic without randomness.
  const wobble = 1 + 0.12 * Math.sin(i * 2.3)
  return { id: `bin-${priceLow}`, priceLow, priceHigh: priceLow + 10, volume: Math.round((main + shelf + 60) * wobble) }
})

export default function VolumeProfileDemo() {
  return (
    <div className="w-[min(94vw,640px)] rounded-2xl border border-border bg-card p-5 text-card-foreground">
      <p className="mb-4 text-sm font-medium">
        ETH / USD <span className="text-muted-foreground">· session volume by price</span>
      </p>
      <VolumeProfile data={DATA} unit="ETH" formatPrice={usd} label="ETH/USD session volume profile" height={300} />
    </div>
  )
}
