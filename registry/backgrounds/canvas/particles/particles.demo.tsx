import { Particles } from './particles'

export default function ParticlesDemo() {
  return (
    <Particles
      quantity={110}
      className="flex h-[500px] w-[min(900px,calc(100vw-4rem))] flex-col items-center justify-center rounded-2xl border px-8 text-center"
    >
      <h2 className="max-w-xl text-5xl font-semibold tracking-tight text-balance">Dust in the light</h2>
      <p className="mt-4 max-w-md text-base text-muted-foreground text-pretty">
        Specks drift down on their own and lean towards your cursor as you move across the field.
      </p>
    </Particles>
  )
}
