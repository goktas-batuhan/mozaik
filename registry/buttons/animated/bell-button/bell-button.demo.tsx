import { BellButton, type BellButtonProps } from './bell-button'

export default function BellButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <BellButton defaultPressed count={3} />
      <div className="flex items-center gap-4">
        <BellButton label="Mute thread" />
        <BellButton label="" aria-label="Notifications" defaultPressed className="w-10 justify-center px-0" />
        <BellButton disabled label="Unavailable" />
      </div>
    </div>
  )
}

export function VariantPreview(props: BellButtonProps) {
  return <BellButton {...props} />
}
