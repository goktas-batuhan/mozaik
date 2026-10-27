import type { ShimmerSkeletonProps } from './shimmer-skeleton'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: ShimmerSkeletonProps }[] = [
  { name: 'avatar', title: 'Avatar', description: 'A round placeholder with a light sweep, sized for a profile picture.', props: { className: 'size-16 rounded-full', label: 'Loading avatar' } },
  { name: 'card', title: 'Card', description: 'A large rounded block that stands in for an image or card.', props: { className: 'h-40 w-72 max-w-full rounded-xl', duration: 2.4, label: 'Loading card' } },
]
