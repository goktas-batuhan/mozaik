import { useEffect, useState } from 'react'
import { AIReasoning } from './ai-reasoning'

/** The stream only runs when the visitor asks for it, so the demo is still on load. */
export default function AIReasoningDemo() {
  const [streaming, setStreaming] = useState(false)

  useEffect(() => {
    if (!streaming) return
    const id = window.setTimeout(() => setStreaming(false), 3000)
    return () => window.clearTimeout(id)
  }, [streaming])

  return (
    <div className="flex w-[min(26rem,90vw)] flex-col gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground">
      <AIReasoning isStreaming={streaming} defaultOpen duration={4.2}>
        <p>The question asks for the cheapest route that still arrives before noon.</p>
        <p className="mt-2">Train A is 12 minutes faster but costs twice as much. Train B arrives at 11:40, inside the limit.</p>
      </AIReasoning>
      <p className="text-sm">Take train B: it arrives at 11:40 and costs half as much.</p>
      <button
        type="button"
        disabled={streaming}
        onClick={() => setStreaming(true)}
        className="w-fit rounded-md border border-border px-3 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        {streaming ? 'Reasoning…' : 'Replay reasoning'}
      </button>
    </div>
  )
}
