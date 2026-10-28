import { HolographicFoil, type HolographicFoilProps } from './holographic-foil'

export default function HolographicFoilDemo() {
  return (
    <HolographicFoil className="flex h-56 w-80 flex-col justify-between">
      <span className="text-xs tracking-widest text-muted-foreground uppercase">Founders Edition</span>
      <span className="block">
        <span className="block text-2xl font-semibold">No. 0042</span>
        <span className="block text-sm text-muted-foreground">Move your pointer to shift the foil.</span>
      </span>
    </HolographicFoil>
  )
}

export function VariantPreview(props: HolographicFoilProps) {
  return (
    <HolographicFoil className="flex h-56 w-80 flex-col justify-between" {...props}>
      <span className="text-xs tracking-widest text-muted-foreground uppercase">Founders Edition</span>
      <span className="text-2xl font-semibold">No. 0042</span>
    </HolographicFoil>
  )
}
