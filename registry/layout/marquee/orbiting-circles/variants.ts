import type { OrbitingCirclesProps } from './orbiting-circles'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: Omit<OrbitingCirclesProps, 'children'> }[] = [
  {
    name: 'counter-clockwise',
    title: 'Counter-clockwise',
    description: 'One ring of icons that circles against the clock on a tight orbit.',
    props: { reverse: true, radius: 110, iconSize: 40, duration: 20 },
  },
  {
    name: 'fast-swarm',
    title: 'Fast swarm',
    description: 'Small icons race around a wide orbit with no ring drawn, about three times faster.',
    props: { path: false, radius: 150, iconSize: 28, duration: 6 },
  },
]
