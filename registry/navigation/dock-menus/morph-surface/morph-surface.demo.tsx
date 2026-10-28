import { MorphSurface } from './morph-surface'

export default function MorphSurfaceDemo() {
  return (
    <div className="flex min-h-64 items-end justify-center">
      <MorphSurface
        triggerLabel="Feedback"
        triggerIcon={
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        }
      />
    </div>
  )
}
