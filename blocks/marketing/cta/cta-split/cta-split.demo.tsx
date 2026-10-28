import { CtaSplit } from './cta-split'

export default function CtaSplitDemo() {
  return (
    <div className="w-full max-w-5xl">
      <CtaSplit
        title="Ship faster with ready-made, animated sections"
        description="Stop rebuilding the same page from scratch. Drop in a section, change the words, and publish."
        primaryAction={{ label: 'Browse sections', href: '#' }}
        secondaryAction={{ label: 'View on GitHub', href: '#' }}
      />
    </div>
  )
}
