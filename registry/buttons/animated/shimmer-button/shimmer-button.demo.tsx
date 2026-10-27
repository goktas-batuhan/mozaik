import { ArrowRight, Sparkles } from 'lucide-react'
import { ShimmerButton, type ShimmerButtonProps } from './shimmer-button'

export default function ShimmerButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <ShimmerButton className="px-8 py-4 text-base">
        <Sparkles aria-hidden className="size-4 text-primary" />
        Shimmer button
        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
      </ShimmerButton>
      <div className="flex items-center gap-4">
        <ShimmerButton shimmerColor="var(--foreground)" duration={4}>
          Neutral light
        </ShimmerButton>
        <ShimmerButton disabled>Disabled</ShimmerButton>
      </div>
    </div>
  )
}

export function VariantPreview(props: Omit<ShimmerButtonProps, 'children'>) {
  return (
    <ShimmerButton className="px-8 py-4 text-base" {...props}>
      Shimmer button
    </ShimmerButton>
  )
}
