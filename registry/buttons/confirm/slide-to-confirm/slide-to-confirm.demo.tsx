import { SlideToConfirm } from './slide-to-confirm'

export default function SlideToConfirmDemo() {
  return (
    <div className="w-[min(92vw,380px)] rounded-2xl border bg-card p-6 text-card-foreground shadow-sm">
      <p className="text-sm text-muted-foreground">Send</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">0.25 ETH</p>
      <dl className="mt-4 mb-6 space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">To</dt>
          <dd className="font-mono">0x71C7…976F</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Network fee</dt>
          <dd className="tabular-nums">~$0.42</dd>
        </div>
      </dl>
      <SlideToConfirm
        label="Slide to send"
        confirmingLabel="Sending"
        doneLabel="Sent"
        onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1200))}
        className="max-w-none"
      />
    </div>
  )
}
