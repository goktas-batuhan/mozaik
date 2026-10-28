import { useState } from 'react'
import { FaviconSearch, type FaviconSearchResult } from './favicon-search'

/** Small inline SVG mark, so the demo needs no network. */
const mark = (path: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`,
  )}`

const ALL: FaviconSearchResult[] = [
  { id: 'docs', title: 'Mozaik Docs', url: 'https://mozaik.example/docs', description: 'Guides and component reference', favicon: mark('<path d="M4 4h12l4 4v12H4z"/><path d="M8 12h8M8 16h8"/>') },
  { id: 'registry', title: 'Registry', url: 'https://mozaik.example/registry', description: 'Install components with the shadcn CLI', favicon: mark('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>') },
  { id: 'changelog', title: 'Changelog', url: 'https://mozaik.example/changelog', description: 'What shipped this week' },
  { id: 'playground', title: 'Playground', url: 'https://mozaik.example/playground', description: 'Try props live in the browser' },
  { id: 'github', title: 'GitHub', url: 'https://github.example/mozaik', description: 'Source code and issues' },
]

export default function FaviconSearchDemo() {
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<string | null>(null)
  const q = query.trim().toLowerCase()
  const results = q
    ? ALL.filter((r) => r.title.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))
    : ALL

  return (
    <div className="flex h-80 w-full max-w-md flex-col gap-3">
      <FaviconSearch
        results={results}
        value={query}
        onValueChange={setQuery}
        onSelect={(r) => setPicked(r.title)}
        showShortcut
        maxResults={4}
      />
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {picked ? `Opened: ${picked}` : 'Pick a result with the mouse or the arrow keys.'}
      </p>
    </div>
  )
}
