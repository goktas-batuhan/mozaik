import { BlurFade } from './blur-fade'

export default function BlurFadeDemo() {
  return (
    <div className="flex w-[min(40rem,90vw)] flex-col items-center gap-4 text-center">
      <BlurFade delay={0.1}>
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">Introducing</p>
      </BlurFade>
      <BlurFade delay={0.25} duration={0.6} blur={10}>
        <h2 className="text-5xl font-semibold tracking-tight">Blur, then clarity</h2>
      </BlurFade>
      <BlurFade delay={0.45}>
        <p className="max-w-md text-muted-foreground">
          Stagger a few of these with <code className="rounded bg-muted px-1.5 py-0.5 text-sm">delay</code> and a page
          assembles itself in order.
        </p>
      </BlurFade>
      <BlurFade delay={0.65} direction="left">
        <a
          href="#start"
          className="mt-2 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Get started
        </a>
      </BlurFade>
    </div>
  )
}
