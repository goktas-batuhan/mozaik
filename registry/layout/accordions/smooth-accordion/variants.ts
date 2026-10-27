import type { SmoothAccordionProps } from './smooth-accordion'

const items = [
  { id: 'what', title: 'What is Mozaik?', content: 'A collection of small, hand-finished React components. Copy one into your project and own the source.' },
  { id: 'install', title: 'How do I add a component?', content: 'Copy the source from its page and install the npm packages it lists. The file is yours to edit.' },
  { id: 'motion', title: 'Does it respect reduced motion?', content: 'Yes. Every animation turns into a calm, static frame when the user prefers reduced motion.' },
]

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: SmoothAccordionProps }[] = [
  { name: 'multiple', title: 'Multiple open', description: 'Several panels can stay open at once, two of them open first.', props: { items, type: 'multiple', defaultValue: ['what', 'motion'] } },
  { name: 'always-open', title: 'Always open', description: 'One panel is always open, so the open header cannot be closed again.', props: { items, type: 'single', collapsible: false, defaultValue: ['install'] } },
]
