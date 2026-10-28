import { SafariMockup } from './safari-mockup'

export default function SafariMockupDemo() {
  return (
    <SafariMockup url="acme.app/dashboard" className="w-[min(94vw,620px)]">
      <div className="grid gap-4 p-5">
        <div className="h-5 w-40 rounded bg-foreground/80" />
        <div className="grid grid-cols-3 gap-3">
          {['Revenue', 'Orders', 'Visitors'].map((t, i) => (
            <div key={t} className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">{t}</p>
              <p className="mt-1 text-lg font-semibold">{['$12.4k', '318', '9,204'][i]}</p>
            </div>
          ))}
        </div>
        <div className="h-32 rounded-lg border border-border bg-gradient-to-t from-primary/25 to-transparent" />
      </div>
    </SafariMockup>
  )
}
