import { LineShadowText } from './line-shadow-text'

export default function LineShadowTextDemo() {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <LineShadowText as="h2" text="Shadow lines" className="text-7xl font-bold tracking-tight" />
      <LineShadowText
        text="Quieter, in the foreground color"
        shadowColor="var(--muted-foreground)"
        duration={2}
        className="text-xl font-semibold"
      />
    </div>
  )
}
