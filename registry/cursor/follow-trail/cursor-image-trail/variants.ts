import type { CursorImageTrailProps } from './cursor-image-trail'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: {
  name: string
  title: string
  description: string
  props: Omit<CursorImageTrailProps, 'items' | 'children'>
}[] = [
  {
    name: 'dense-small',
    title: 'Dense and small',
    description: 'Small, unrotated tiles drop every few pixels and vanish quickly.',
    props: { distance: 40, itemSize: 56, duration: 0.4, rotate: 0 },
  },
  {
    name: 'big-lazy',
    title: 'Big and lazy',
    description: 'Large, tilted tiles are spaced far apart and linger for over a second.',
    props: { distance: 160, itemSize: 160, duration: 1.2, rotate: 30 },
  },
]
