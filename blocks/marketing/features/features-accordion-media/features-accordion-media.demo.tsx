import { FeaturesAccordionMedia } from './features-accordion-media'

function Scene({ children }: { children: React.ReactNode }) {
  return (
    <div aria-hidden className="grid size-full place-items-center bg-linear-to-br from-primary/15 via-transparent to-primary/5 p-8">
      {children}
    </div>
  )
}

const Bars = () => (
  <Scene>
    <div className="flex h-40 w-full max-w-xs items-end gap-2">
      {[40, 65, 50, 85, 70, 100].map((h, i) => (
        <span key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-t-md ${i === 5 ? 'bg-primary' : 'bg-primary/25'}`} />
      ))}
    </div>
  </Scene>
)

const Chat = () => (
  <Scene>
    <div className="w-full max-w-xs space-y-3">
      <span className="block h-9 w-3/4 rounded-2xl rounded-bl-sm bg-muted" />
      <span className="ml-auto block h-9 w-2/3 rounded-2xl rounded-br-sm bg-primary" />
      <span className="block h-9 w-1/2 rounded-2xl rounded-bl-sm bg-muted" />
    </div>
  </Scene>
)

const Shield = () => (
  <Scene>
    <svg viewBox="0 0 24 24" className="size-32 text-primary" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="fill-primary/10" />
      <path d="m8.5 12 2.5 2.5 4.5-5" strokeLinecap="round" />
    </svg>
  </Scene>
)

export default function FeaturesAccordionMediaDemo() {
  return (
    <div className="w-full max-w-5xl">
      <FeaturesAccordionMedia
        title="One place for the whole team"
        description="Open a row to see it in action."
        items={[
          { id: 'insights', title: 'Insights that explain themselves', description: 'Dashboards annotate every spike so you know what changed and why.', media: <Bars /> },
          { id: 'inbox', title: 'A shared inbox that stays calm', description: 'Threads are assigned, snoozed and resolved without leaving the page.', media: <Chat /> },
          { id: 'security', title: 'Security you do not have to think about', description: 'Single sign-on, audit logs and encryption are on from day one.', media: <Shield /> },
        ]}
      />
    </div>
  )
}
