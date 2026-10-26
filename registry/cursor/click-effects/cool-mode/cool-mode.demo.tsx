import { CoolMode } from './cool-mode'

const button =
  'rounded-full px-7 py-4 text-base font-medium shadow-lg transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring'

export default function CoolModeDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-10 text-center">
      <div className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Press and hold</p>
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Make it a little louder</h2>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <CoolMode>
          <button type="button" className={`${button} bg-primary text-primary-foreground shadow-primary/20`}>
            Celebrate
          </button>
        </CoolMode>
        <CoolMode particle="✨" size={20} count={30}>
          <button type="button" className={`${button} border bg-card text-card-foreground`}>
            Sparkles
          </button>
        </CoolMode>
      </div>
    </div>
  )
}
