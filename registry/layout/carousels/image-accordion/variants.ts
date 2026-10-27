import type { ImageAccordionProps } from './image-accordion'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: Omit<ImageAccordionProps, 'items'> }[] = [
  {
    name: 'click',
    title: 'Click to open',
    description: 'Panels open only on click or focus, so a passing pointer changes nothing.',
    props: { trigger: 'click', height: 280 },
  },
]
