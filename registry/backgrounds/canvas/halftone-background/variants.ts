import type { HalftoneBackgroundProps } from './halftone-background'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: HalftoneBackgroundProps }[] = [
  { name: 'coarse-newsprint', title: 'Coarse newsprint', description: 'Big, widely spaced dots at a shallow screen angle, like cheap newsprint.', props: { cell: 20, angle: 15, children: 'Extra, extra' } },
  { name: 'fine-still', title: 'Fine and still', description: 'A tight, fine screen with the light held in place.', props: { cell: 5, speed: 0, interactive: false, children: 'Fine screen' } },
]
