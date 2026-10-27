import type { TopoBackgroundProps } from './topo-background'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: TopoBackgroundProps }[] = [
  { name: 'dense-contours', title: 'Dense contours', description: 'Closely packed contour lines on a different terrain.', props: { interval: 0.025, seed: 7, children: 'Dense map' } },
  { name: 'still-relief', title: 'Still relief', description: 'Widely spaced contours on frozen terrain that ignores the cursor.', props: { interval: 0.18, speed: 0, interactive: false, seed: 3, children: 'Still relief' } },
]
