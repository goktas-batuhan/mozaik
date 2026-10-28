import { SpinningText } from './spinning-text'

export default function SpinningTextDemo() {
  return (
    <div className="flex items-center gap-12">
      <SpinningText text="learn more • earn more • " radius={6} className="text-lg font-medium tracking-wide" />
      <SpinningText
        text="read the docs • read the docs • "
        reverse
        duration={16}
        radius={5}
        className="text-sm text-muted-foreground"
      />
    </div>
  )
}
