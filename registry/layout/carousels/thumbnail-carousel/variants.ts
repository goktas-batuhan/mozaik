import type { ThumbnailCarouselProps } from './thumbnail-carousel'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: Omit<ThumbnailCarouselProps, 'items'> }[] = [
  {
    name: 'banner',
    title: 'Banner',
    description: 'A low, wide slide above the thumbnail strip, like a hero banner.',
    props: { height: 150, label: 'Trail photos' },
  },
  {
    name: 'tall',
    title: 'Tall',
    description: 'A tall slide that gives each photo a portrait-like frame.',
    props: { height: 460, label: 'Trail photos', defaultIndex: 3 },
  },
]
