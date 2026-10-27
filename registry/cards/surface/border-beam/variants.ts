import type { BorderBeamProps } from './border-beam'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: {
  name: string
  title: string
  description: string
  props: BorderBeamProps
}[] = [
  {
    name: 'bold-fast',
    title: 'Bold and fast',
    description: 'A large, thick comet that laps the card edge in three seconds.',
    props: { size: 200, duration: 3, borderWidth: 3 },
  },
  {
    name: 'slow-reverse',
    title: 'Slow reverse',
    description: 'A small light that drifts counter-clockwise, taking twelve seconds per lap.',
    props: { size: 50, duration: 12, reverse: true },
  },
]
