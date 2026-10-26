import { ChromaticTextReveal } from './chromatic-text-reveal'

export default function ChromaticTextRevealDemo() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <ChromaticTextReveal
        prefix="Design that feels"
        words={['effortless', 'considered', 'alive']}
        className="text-5xl font-semibold tracking-tight"
      />
      <p className="max-w-md text-sm text-muted-foreground">
        Each word is painted in by a soft colored edge, then makes room for the next.
      </p>
    </div>
  )
}
