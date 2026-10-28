import { SparklesText } from './sparkles-text'

export default function SparklesTextDemo() {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <SparklesText as="h2" text="Something special" className="text-6xl font-semibold tracking-tight" />
      <SparklesText
        text="Fewer sparkles, softer light"
        sparkles={5}
        duration={2.4}
        colors={['var(--muted-foreground)', 'var(--foreground)']}
        className="text-lg text-muted-foreground"
      />
    </div>
  )
}
