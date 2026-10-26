import { RingSpinner } from './ring-spinner'

export default function RingSpinnerDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-end gap-8">
        <RingSpinner size="sm" />
        <RingSpinner size="md" />
        <RingSpinner size="lg" />
      </div>
      <div className="inline-flex items-center gap-3 rounded-full border bg-card px-5 py-2.5 text-sm text-muted-foreground">
        <RingSpinner size="sm" className="text-primary" label="Syncing" />
        Syncing your workspace
      </div>
    </div>
  )
}
