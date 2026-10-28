import { FlowField } from './flow-field'

export default function FlowFieldDemo() {
  return (
    <FlowField className="flex h-[500px] w-[min(900px,calc(100vw-4rem))] flex-col items-center justify-center rounded-2xl border px-8 text-center">
      <h2 className="max-w-xl text-5xl font-semibold tracking-tight text-balance">Go with the flow</h2>
      <p className="mt-4 max-w-md text-base text-muted-foreground text-pretty">
        Wind drawn in thin streamlines. Move your cursor through it and the air parts around you.
      </p>
    </FlowField>
  )
}
