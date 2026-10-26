import { ShineText } from './shine-text'

export default function ShineTextDemo() {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <ShineText className="text-6xl font-semibold tracking-tight">Crafted with care</ShineText>
      <ShineText
        duration={3.2}
        baseColor="var(--primary)"
        shineColor="var(--foreground)"
        className="text-xl font-medium"
      >
        A light that moves through the words
      </ShineText>
    </div>
  )
}
