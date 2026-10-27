import type { ProgressiveBlurProps } from './progressive-blur'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: ProgressiveBlurProps }[] = [
  {
    name: 'top-fade',
    title: 'Top edge',
    description: 'Blurs only the top edge, as under a sticky header.',
    props: { position: 'top', height: '5rem' },
  },
  {
    name: 'deep-bottom',
    title: 'Deep bottom',
    description: 'A tall bottom blur that fades about a third of the list into haze.',
    props: { position: 'bottom', height: '9rem' },
  },
]
