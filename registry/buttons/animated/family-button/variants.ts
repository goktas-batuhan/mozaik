import type { FamilyButtonProps } from './family-button'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: {
  name: string
  title: string
  description: string
  props: Omit<FamilyButtonProps, 'children'>
}[] = [
  {
    name: 'open-wide',
    title: 'Open and wide',
    description: 'Starts open with a wider, shorter panel so the actions sit in a roomier tray.',
    props: {
      label: 'Quick actions',
      defaultOpen: true,
      width: 340,
      height: 180,
    },
  },
]
