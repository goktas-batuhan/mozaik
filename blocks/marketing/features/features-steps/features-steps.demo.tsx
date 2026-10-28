import { FeaturesSteps } from './features-steps'

const Snippet = ({ children }: { children: string }) => (
  <code className="inline-block rounded-lg border border-border bg-muted px-3 py-2 font-mono text-xs text-foreground">
    <span className="text-primary">$</span> {children}
  </code>
)

export default function FeaturesStepsDemo() {
  return (
    <div className="w-full max-w-4xl">
      <FeaturesSteps
        eyebrow="How it works"
        title="From zero to a live section in three steps"
        description="No account, no config file, no surprises."
        steps={[
          { title: 'Pick a block', description: 'Browse the gallery and find the section that fits your page.' },
          { title: 'Add it to your project', description: 'One command copies the source and every component it needs.', visual: <Snippet>npx shadcn add features-steps</Snippet> },
          { title: 'Make it yours', description: 'Edit the copy, swap the tokens and keep every line under your control.' },
        ]}
      />
    </div>
  )
}
