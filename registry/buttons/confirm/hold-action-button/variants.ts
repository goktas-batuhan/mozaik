import type { HoldActionButtonProps } from './hold-action-button'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: {
  name: string
  title: string
  description: string
  props: HoldActionButtonProps
}[] = [
  {
    name: 'quick-hold',
    title: 'Quick hold',
    description: 'Fills and confirms after only half a second of holding.',
    props: {
      children: 'Hold to archive',
      duration: 0.5,
      holdingLabel: 'Archiving...',
      completeLabel: 'Archived',
    },
  },
  {
    name: 'long-hold',
    title: 'Long hold',
    description: 'Needs a deliberate four-second press before the action fires.',
    props: {
      children: 'Hold to delete everything',
      duration: 4,
      holdingLabel: 'Keep holding...',
      completeLabel: 'Deleted',
    },
  },
]
