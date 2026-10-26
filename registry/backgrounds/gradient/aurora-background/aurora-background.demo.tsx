import { ArrowRight } from 'lucide-react'
import { AuroraBackground } from './aurora-background'

export default function AuroraBackgroundDemo() {
  return (
    <AuroraBackground className="flex h-[500px] w-[min(900px,calc(100vw-4rem))] flex-col items-center justify-center rounded-2xl border px-8 text-center">
      <span className="rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
        Now in public beta
      </span>
      <h2 className="mt-6 max-w-xl text-5xl font-semibold tracking-tight text-balance">
        Ship interfaces that feel alive
      </h2>
      <p className="mt-4 max-w-md text-base text-muted-foreground text-pretty">
        A slow, soft aurora that stays out of the way of your content and rests when
        nobody is looking.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Get started <ArrowRight aria-hidden className="size-4" />
        </a>
        <a
          href="#"
          className="rounded-full border bg-background/60 px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Read the docs
        </a>
      </div>
    </AuroraBackground>
  )
}
