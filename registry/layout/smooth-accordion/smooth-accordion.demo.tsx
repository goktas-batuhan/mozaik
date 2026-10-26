import { SmoothAccordion } from './smooth-accordion'

const items = [
  {
    id: 'what',
    title: 'What is Mozaik?',
    content: 'A registry of small, hand-finished React components. Install one with a single shadcn command and own the source.',
  },
  {
    id: 'install',
    title: 'How do I install a component?',
    content: 'Run npx shadcn add with the component URL. The file lands in your project, ready to edit.',
  },
  {
    id: 'motion',
    title: 'Does it respect reduced motion?',
    content: 'Yes. Every animation turns into a calm, static frame when the user prefers reduced motion.',
  },
  {
    id: 'keys',
    title: 'Can I use it with the keyboard?',
    content: 'Headers are real buttons. Use Tab, Enter and Space, or the arrow keys, Home and End to move between them.',
  },
]

export default function SmoothAccordionDemo() {
  return (
    <div className="w-[520px] max-w-full">
      <SmoothAccordion items={items} defaultValue={['what']} />
    </div>
  )
}
