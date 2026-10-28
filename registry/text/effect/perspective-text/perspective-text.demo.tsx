import { PerspectiveText } from './perspective-text'

export default function PerspectiveTextDemo() {
  return (
    <div className="flex flex-col items-center gap-10 py-6 text-center">
      <PerspectiveText text="Depth is a design tool" className="text-6xl font-bold tracking-tight" />
      <PerspectiveText
        split="lines"
        text={'Each line sits on its own layer\nMove the cursor across them'}
        depth={28}
        className="text-xl text-muted-foreground"
      />
    </div>
  )
}
