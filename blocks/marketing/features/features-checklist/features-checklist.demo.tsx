import { FeaturesChecklist } from './features-checklist'

export default function FeaturesChecklistDemo() {
  return (
    <div className="w-full max-w-5xl">
      <FeaturesChecklist
        eyebrow="Included in every plan"
        title="Everything you need, nothing you have to unlock"
        description="No feature gates. Start free and keep every capability as you grow."
        action={{ label: 'Start for free', href: '#' }}
        items={[
          { title: 'Unlimited projects', description: 'Create as many as you like.' },
          { title: 'Custom domains', description: 'With automatic certificates.' },
          { title: 'Team workspaces' },
          { title: 'Version history', description: '90 days, always on.' },
          { title: 'Single sign-on' },
          { title: 'Audit logs', description: 'Export any time.' },
          { title: 'Priority support' },
          { title: 'Data export', description: 'JSON and CSV.' },
        ]}
      />
    </div>
  )
}
