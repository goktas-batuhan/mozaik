import type { LensProps } from './lens'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: Omit<LensProps, 'children'> }[] = [
  {
    name: 'loupe',
    title: 'Loupe',
    description: 'A small lens at triple zoom for reading the finest print.',
    props: { zoomFactor: 3, lensSize: 120, className: 'border border-border' },
  },
  {
    name: 'wide-lens',
    title: 'Wide lens',
    description: 'A large, gentle lens that covers a third of the card at a mild zoom.',
    props: { zoomFactor: 1.35, lensSize: 260, className: 'border border-border' },
  },
]
