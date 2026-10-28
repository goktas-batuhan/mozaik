import { AISources } from './ai-sources'

const SOURCES = [
  { id: 'mdn', title: 'prefers-reduced-motion', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion' },
  { id: 'wcag', title: 'Understanding animation from interactions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html', site: 'w3.org' },
  { id: 'motion', title: 'Accessibility in Motion', url: 'https://motion.dev/docs/react-accessibility' },
]

export default function AISourcesDemo() {
  return (
    <div className="w-[min(92vw,460px)]">
      <AISources sources={SOURCES} defaultOpen />
    </div>
  )
}
