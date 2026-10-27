import type { TerminalProps } from './terminal'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: Omit<TerminalProps, 'children'> }[] = [
  {
    name: 'parallel',
    title: 'Parallel lines',
    description: 'Lines run on their own delays instead of waiting for the one before, so the output lands almost at once.',
    props: { title: '~/mozaik-site', className: 'h-80', sequence: false, startOnView: false },
  },
]
