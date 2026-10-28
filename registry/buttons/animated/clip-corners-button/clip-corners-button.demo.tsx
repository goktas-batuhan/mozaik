import { ClipCornersButton, type ClipCornersButtonProps } from './clip-corners-button'

export default function ClipCornersButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <ClipCornersButton>Initialize</ClipCornersButton>
      <div className="flex items-center gap-4">
        <ClipCornersButton cut={4} hoverCut={10} className="h-10 px-6">
          Subtle cut
        </ClipCornersButton>
        <ClipCornersButton cut={16} hoverCut={24} className="h-14 px-10 text-base">
          Deep cut
        </ClipCornersButton>
        <ClipCornersButton disabled>Disabled</ClipCornersButton>
      </div>
    </div>
  )
}

export function VariantPreview(props: Omit<ClipCornersButtonProps, 'children'>) {
  return <ClipCornersButton {...props}>Initialize</ClipCornersButton>
}
