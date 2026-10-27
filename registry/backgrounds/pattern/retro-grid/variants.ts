import type { RetroGridProps } from './retro-grid'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: RetroGridProps }[] = [
  { name: 'steep-slow', title: 'Steep and slow', description: 'A steeply tilted floor of large cells rolling slowly.', props: { angle: 80, cellSize: 100, duration: 40, className: 'relative h-64 w-[28rem] max-w-full overflow-hidden rounded-xl border bg-background' } },
  { name: 'flat-fast', title: 'Flat and fast', description: 'A shallow tilt of small cells rushing past.', props: { angle: 35, cellSize: 32, duration: 6, className: 'relative h-64 w-[28rem] max-w-full overflow-hidden rounded-xl border bg-background' } },
]
