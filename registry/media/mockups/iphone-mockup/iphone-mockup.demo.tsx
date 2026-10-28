import { IphoneMockup } from './iphone-mockup'

function Screen() {
  return (
    <div className="flex size-full flex-col gap-3 bg-gradient-to-b from-primary/20 to-background px-5 pt-[18%] pb-6">
      <p className="text-xs text-muted-foreground">Today</p>
      <p className="text-2xl font-semibold text-foreground">Good morning</p>
      <div className="mt-2 flex flex-col gap-2">
        {['Design review', 'Ship the release', 'Lunch with Ada'].map((t, i) => (
          <div key={t} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 text-sm text-card-foreground">
            <span className="size-2 rounded-full bg-primary" style={{ opacity: 1 - i * 0.25 }} />
            {t}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function IphoneMockupDemo() {
  return (
    <div className="w-[min(70vw,260px)]">
      <IphoneMockup>
        <Screen />
      </IphoneMockup>
    </div>
  )
}
