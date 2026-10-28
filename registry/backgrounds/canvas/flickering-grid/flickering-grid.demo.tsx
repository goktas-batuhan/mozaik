import { FlickeringGrid } from './flickering-grid'

export default function FlickeringGridDemo() {
  return (
    <FlickeringGrid
      maxOpacity={0.35}
      className="flex h-[500px] w-[min(900px,calc(100vw-4rem))] flex-col items-center justify-center rounded-2xl border px-8 text-center"
    >
      <h2 className="max-w-xl text-5xl font-semibold tracking-tight text-balance">Signal in the noise</h2>
      <p className="mt-4 max-w-md text-base text-muted-foreground text-pretty">
        A grid of tiny squares that blink on their own. Quiet enough to sit behind a headline.
      </p>
    </FlickeringGrid>
  )
}
