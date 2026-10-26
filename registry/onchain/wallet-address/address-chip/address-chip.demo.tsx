import { ArrowRight } from 'lucide-react'
import { AddressChip } from './address-chip'

// Made-up addresses for the demo.
const transfers = [
  {
    from: { address: '0x33cEb14560bd33b977Ada347Daa646D53418F12D', label: 'mozaik.eth' },
    to: { address: '0xBf38e418004a7f37b709a2ac6b392f0986470c30' },
    amount: '2.40 ETH',
  },
  {
    from: { address: '0x2c9E054777108e030220c01aBefCcf4373faB57F' },
    to: { address: '0x9baFb72f91b8789582615B6908429433f0d7707C', label: 'atlas.eth' },
    amount: '1,250 USDC',
  },
  {
    from: { address: '0x392B4d7cfFcaD51F11007Ab30606d59f0C0e6796', label: 'orbit.eth' },
    to: { address: '0x1d3Ee4Cb1365556C2c4bf6adD137bcA43De92211' },
    amount: '0.75 ETH',
  },
]

const explorer = (address: string) => `https://etherscan.io/address/${address}`

export default function AddressChipDemo() {
  return (
    <div className="w-[min(92vw,620px)] space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <AddressChip address="0x33cEb14560bd33b977Ada347Daa646D53418F12D" label="mozaik.eth" href={explorer('0x33cEb14560bd33b977Ada347Daa646D53418F12D')} />
        <AddressChip address="0xBf38e418004a7f37b709a2ac6b392f0986470c30" chars={6} />
        <AddressChip address="0xnot-an-address" />
      </div>

      <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-3 text-sm">
          <span className="font-medium">Recent transfers</span>
          <span className="text-muted-foreground">Last 24h</span>
        </div>
        <ul className="divide-y">
          {transfers.map((t, i) => (
            <li key={i} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <AddressChip {...t.from} href={explorer(t.from.address)} />
              <ArrowRight aria-hidden className="size-4 text-muted-foreground" />
              <AddressChip {...t.to} href={explorer(t.to.address)} />
              <span className="ml-auto font-mono text-sm tabular-nums">{t.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
