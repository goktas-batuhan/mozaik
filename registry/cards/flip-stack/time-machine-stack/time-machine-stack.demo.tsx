import { TimeMachineStack, type TimeMachineStackItem, type TimeMachineStackProps } from './time-machine-stack'

const entries = [
  ['Today', 'Shipped the new onboarding flow.'],
  ['Last week', 'Moved search to a command palette.'],
  ['Last month', 'Rebuilt the settings page.'],
  ['Last quarter', 'Launched the public API.'],
  ['Last year', 'First prototype went live.'],
]

export const items: TimeMachineStackItem[] = entries.map(([when, text]) => ({
  id: when,
  label: when,
  content: (
    <div className="flex h-full flex-col justify-between p-6">
      <span className="text-xs tracking-widest text-muted-foreground uppercase">{when}</span>
      <span className="text-lg font-medium">{text}</span>
    </div>
  ),
}))

export default function TimeMachineStackDemo() {
  return (
    <div className="pt-16">
      <TimeMachineStack items={items} />
    </div>
  )
}

export function VariantPreview(props: Omit<TimeMachineStackProps, 'items'>) {
  return (
    <div className="pt-16">
      <TimeMachineStack items={items} {...props} />
    </div>
  )
}
