import type { DockProps } from './dock'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: Omit<DockProps, 'children'> }[] = [
  {
    name: 'big-swell',
    title: 'Big swell',
    description: 'Small resting icons that swell to more than twice their size over a wide reach.',
    props: { iconSize: 32, iconMagnification: 88, iconDistance: 220 },
  },
  {
    name: 'centered',
    title: 'Centered growth',
    description: 'Icons grow outward from the middle of the dock instead of rising from the bottom edge.',
    props: { direction: 'middle', iconSize: 44, iconMagnification: 72 },
  },
]
