import type { DragCarouselProps } from './drag-carousel'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: Omit<DragCarouselProps, 'children'> }[] = [
  {
    name: 'peek-strip',
    title: 'Peek strip',
    description: 'Narrow, tightly packed slides with no buttons, so the row is moved by dragging alone.',
    props: { label: 'Component categories', slideWidth: '9rem', gap: 8, controls: false, elasticity: 0.4 },
  },
  {
    name: 'wide-slides',
    title: 'Wide slides',
    description: 'Large slides with generous gaps, so only one and a half fit in view.',
    props: { label: 'Component categories', slideWidth: '26rem', gap: 24 },
  },
]
