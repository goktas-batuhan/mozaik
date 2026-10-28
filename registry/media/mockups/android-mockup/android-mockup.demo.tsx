import { AndroidMockup } from './android-mockup'

export default function AndroidMockupDemo() {
  return (
    <div className="w-[min(60vw,240px)]">
      <AndroidMockup>
        <div className="flex size-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/25 via-background to-background p-6 text-center">
          <svg viewBox="0 0 24 24" className="size-10 text-primary" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-2.6-6.4-2.1 2.1M7.7 16.3l-2.1 2.1m0-12.8 2.1 2.1m8.6 8.6 2.1 2.1" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <p className="text-lg font-semibold">All set</p>
          <p className="text-xs text-muted-foreground">Your workspace is ready.</p>
          <span className="mt-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">Continue</span>
        </div>
      </AndroidMockup>
    </div>
  )
}
