import { Inbox } from 'lucide-react'
import { EmptyState } from './empty-state'

export default function EmptyStateDemo() {
  return (
    <EmptyState
      icon={<Inbox />}
      title="No transactions yet"
      description="Once you connect a wallet, your latest activity shows up here."
      action={
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Connect wallet
        </button>
      }
    />
  )
}
