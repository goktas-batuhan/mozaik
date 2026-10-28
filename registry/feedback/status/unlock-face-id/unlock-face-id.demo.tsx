import { UnlockFaceId } from './unlock-face-id'

export default function UnlockFaceIdDemo() {
  return (
    <UnlockFaceId className="w-[min(92vw,320px)]">
      <div className="rounded-2xl border bg-card p-5 text-card-foreground shadow-sm">
        <p className="text-xs text-muted-foreground">Portfolio balance</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">$48,210.55</p>
        <p className="mt-3 text-sm text-muted-foreground">3 wallets · last synced a minute ago</p>
      </div>
    </UnlockFaceId>
  )
}
