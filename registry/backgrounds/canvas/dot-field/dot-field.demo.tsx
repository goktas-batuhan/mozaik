import { DotField } from './dot-field'

export default function DotFieldDemo() {
  return (
    <DotField className="flex h-[500px] w-[min(900px,calc(100vw-4rem))] flex-col items-center justify-center rounded-2xl border px-8 text-center">
      <h2 className="max-w-xl text-5xl font-semibold tracking-tight text-balance">Press to ripple</h2>
      <p className="mt-4 max-w-md text-base text-muted-foreground text-pretty">
        A halftone on a springy membrane. Swipe across it to drag the dots, or click to send a ring through them.
      </p>
    </DotField>
  )
}
