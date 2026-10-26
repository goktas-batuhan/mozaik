import { AmountPad } from './amount-pad'

export default function AmountPadDemo() {
  return (
    <AmountPad symbol="ETH" symbolPosition="suffix" decimals={4} max={5} balance={3.2041} presets={[0.1, 0.5, 1]}>
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-muted font-mono text-xs font-medium">0x</span>
        <div className="min-w-0 leading-tight">
          <p className="text-xs text-muted-foreground">Send to</p>
          <p className="truncate font-mono text-sm font-medium">0x71C7…976F</p>
        </div>
      </div>
    </AmountPad>
  )
}
