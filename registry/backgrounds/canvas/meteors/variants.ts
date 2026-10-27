import type { MeteorsProps } from './meteors'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: MeteorsProps }[] = [
  { name: 'shower', title: 'Shower', description: 'A dense, fast shower of short meteors.', props: { number: 60, minDuration: 1.2, maxDuration: 2.5, distance: 400, className: 'relative h-64 w-[28rem] max-w-full overflow-hidden rounded-xl border' } },
  { name: 'slanted', title: 'Slanted', description: 'A few slow meteors leaning right instead of left.', props: { number: 8, angle: -35, minDuration: 5, maxDuration: 9, className: 'relative h-64 w-[28rem] max-w-full overflow-hidden rounded-xl border' } },
]
