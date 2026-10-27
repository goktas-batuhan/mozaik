import type { SplitFlapTextProps } from './split-flap-text'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: SplitFlapTextProps }[] = [
  { name: 'rapid-board', title: 'Rapid board', description: 'A departures board that flips quickly through city names.', props: { words: ['Berlin', 'Tokyo', 'Lisbon', 'Oslo'], interval: 1.2, duration: 0.2, className: 'text-4xl sm:text-6xl' } },
]
