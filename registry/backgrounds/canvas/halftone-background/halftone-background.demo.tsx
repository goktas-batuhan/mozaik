import { HalftoneBackground } from './halftone-background'

export default function HalftoneBackgroundDemo() {
  return (
    <HalftoneBackground className="flex h-[500px] w-[min(900px,calc(100vw-4rem))] flex-col items-center justify-end rounded-2xl border px-8 pb-10 text-center sm:items-start sm:justify-center sm:pb-0 sm:pl-14 sm:text-left">
      <h2 className="max-w-sm text-5xl font-semibold tracking-tight text-balance">Printed in dots</h2>
      <p className="mt-4 max-w-sm text-base text-muted-foreground text-pretty">
        A halftone screen where the size of every dot is the amount of ink. The light circles
        the sphere on its own; move your cursor to take it for a walk.
      </p>
    </HalftoneBackground>
  )
}
