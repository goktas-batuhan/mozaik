import { useState } from 'react'
import { AISuggestions, type AISuggestion } from './ai-suggestions'

const IDEAS: AISuggestion[] = [
  { id: 'summary', label: 'Summarize this page' },
  { id: 'tests', label: 'Write tests for it' },
  { id: 'explain', label: 'Explain like I am new' },
  { id: 'shorter', label: 'Make it shorter' },
]

export default function AISuggestionsDemo() {
  const [picked, setPicked] = useState<string | null>(null)

  return (
    <div className="flex w-[min(92vw,460px)] flex-col gap-3">
      <AISuggestions label="Try asking" suggestions={IDEAS} onSelect={(s) => setPicked(s.label)} />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {picked ? `You picked: ${picked}` : 'Pick a suggestion.'}
      </p>
    </div>
  )
}
