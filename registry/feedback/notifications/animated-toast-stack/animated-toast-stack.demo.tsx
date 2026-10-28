import { useAnimatedToastStack, AnimatedToastStack, type ToastInput } from './animated-toast-stack'

const SAMPLES: ToastInput[] = [
  { title: 'Swap submitted', description: 'Waiting for 1 confirmation', status: 'loading' },
  { title: 'Swap confirmed', description: '0.5 ETH for 1,840 USDC', status: 'success' },
  { title: 'Price alert', description: 'ETH crossed $3,800', status: 'info' },
  { title: 'Transaction failed', description: 'Slippage too high', status: 'error' },
]

const button =
  'inline-flex h-9 items-center rounded-md border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

export default function AnimatedToastStackDemo() {
  const { toasts, showToast, dismissToast, clearToasts } = useAnimatedToastStack({ defaultDuration: 6000, limit: 4 })

  return (
    <div className="flex w-[min(92vw,420px)] flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-2">
        {SAMPLES.map((sample) => (
          <button key={String(sample.title)} type="button" className={button} onClick={() => showToast(sample)}>
            {sample.status}
          </button>
        ))}
        <button type="button" className={button} onClick={clearToasts}>
          Clear
        </button>
      </div>
      <div className="min-h-40 w-full">
        <AnimatedToastStack
          toasts={toasts.length ? toasts : [{ id: 'hint', title: 'Press a button', description: 'Toasts stack here and swipe away.', dismissible: false }]}
          onDismiss={dismissToast}
          position="top-center"
          className="w-full"
        />
      </div>
    </div>
  )
}
