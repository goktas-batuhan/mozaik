import { FeaturesIntegrationsBeam } from './features-integrations-beam'

const sources = ['Docs', 'Mail', 'Chat'].map((label) => ({ label, icon: label[0] }))
const targets = ['Git', 'Pay', 'Data'].map((label) => ({ label, icon: label[0] }))

export default function FeaturesIntegrationsBeamDemo() {
  return (
    <div className="w-full max-w-5xl">
      <FeaturesIntegrationsBeam
        title="Plugs into the tools you already use"
        description="Connect once and data flows both ways, with no glue code to maintain."
        points={['Two-way sync in real time', 'Over 100 ready-made connectors', 'Webhooks for everything else']}
        sources={sources}
        targets={targets}
        hubLabel="Mozaik hub"
        hub={
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
          </svg>
        }
      />
    </div>
  )
}
