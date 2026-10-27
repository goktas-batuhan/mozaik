import type { AIReasoningProps } from './ai-reasoning'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: Omit<AIReasoningProps, 'children'> }[] = [
  { name: 'streaming', title: 'Streaming', description: 'Open and shimmering while the model is still reasoning.', props: { isStreaming: true, defaultOpen: true } },
  { name: 'collapsed', title: 'Collapsed', description: 'A finished trace folded down to its one-line summary.', props: { isStreaming: false, defaultOpen: false, duration: 4.2 } },
]
