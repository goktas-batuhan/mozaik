import { LightRays } from './light-rays'

export default function LightRaysDemo() {
  return (
    <LightRays className="flex h-[500px] w-[min(900px,calc(100vw-4rem))] flex-col items-center justify-center rounded-2xl border px-8 text-center">
      <h2 className="max-w-xl text-5xl font-semibold tracking-tight text-balance">Let there be light</h2>
      <p className="mt-4 max-w-md text-base text-muted-foreground text-pretty">
        Shafts of light drift in from the top corners, swell and fade away again.
      </p>
    </LightRays>
  )
}
