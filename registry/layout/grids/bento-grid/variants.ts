import type { BentoGridProps } from './bento-grid'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: Omit<BentoGridProps, 'children'> }[] = [
  {
    name: 'two-columns',
    title: 'Two columns',
    description: 'A wider two-column grid with tall rows, so each tile gets room for its artwork.',
    props: { columns: 2, rowHeight: '14rem' },
  },
  {
    name: 'four-columns',
    title: 'Four columns',
    description: 'A dense four-column grid with short rows that packs the same tiles into a tighter mosaic.',
    props: { columns: 4, rowHeight: '8rem' },
  },
]
