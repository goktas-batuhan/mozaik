import { LinenTabButton } from './linen-tab-button'

export default function LinenTabButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <LinenTabButton />
      <LinenTabButton>Open notes</LinenTabButton>
      <LinenTabButton disabled>Unavailable</LinenTabButton>
    </div>
  )
}
