import { DotMorphButton, type DotMorphButtonProps } from './dot-morph-button'

export default function DotMorphButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <DotMorphButton label="Get in touch" />
      <div className="flex items-center gap-4">
        <DotMorphButton label="Say hello" className="h-10 text-base" />
        <DotMorphButton label="Unavailable" disabled className="h-10 text-base" />
      </div>
    </div>
  )
}

export function VariantPreview(props: DotMorphButtonProps) {
  return <DotMorphButton {...props} />
}
