import { ArrowRight, Sparkles } from 'lucide-react'
import { ShaderBackground } from './shader-background'

export default function ShaderBackgroundDemo() {
  return (
    <ShaderBackground className="flex h-[500px] w-[min(900px,calc(100vw-4rem))] flex-col items-start justify-end rounded-2xl border p-10">
      <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
        <Sparkles aria-hidden className="size-3.5" />
        Raw WebGL, zero dependencies
      </span>
      <h2 className="mt-5 max-w-lg text-5xl font-semibold tracking-tight text-balance">
        Color that moves like weather
      </h2>
      <p className="mt-4 max-w-md text-base text-muted-foreground text-pretty">
        A fragment shader tinted by your theme tokens. It sleeps off screen and settles
        into a single frame when motion is reduced.
      </p>
      <a
        href="#"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Explore the field <ArrowRight aria-hidden className="size-4" />
      </a>
    </ShaderBackground>
  )
}
