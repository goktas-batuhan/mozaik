import { Meteors } from './meteors'

export default function MeteorsDemo() {
  return (
    <div className="relative flex h-[26rem] w-[min(48rem,90vw)] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card">
      <Meteors number={26} distance={560} />
      <p className="relative text-xs font-medium tracking-widest text-muted-foreground uppercase">Night shift</p>
      <h3 className="relative mt-3 text-4xl font-semibold tracking-tight text-card-foreground">Quiet sky, busy build</h3>
      <p className="relative mt-2 max-w-sm text-center text-sm text-muted-foreground">
        Meteors fill whatever box you put them in, and stay behind your content.
      </p>
    </div>
  )
}
