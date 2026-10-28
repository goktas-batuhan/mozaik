import { useState } from 'react'
import { AIPromptInput } from './ai-prompt-input'

export default function AIPromptInputDemo() {
  const [sent, setSent] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex w-[min(92vw,460px)] flex-col gap-3">
      <AIPromptInput
        loading={loading}
        onSubmit={(text) => {
          setSent((s) => [text, ...s].slice(0, 3))
          setLoading(true)
        }}
        onStop={() => setLoading(false)}
        actions={<span className="px-1 text-xs text-muted-foreground">Enter to send</span>}
      />
      <ul className="flex list-none flex-col gap-1 text-sm text-muted-foreground" aria-live="polite">
        {sent.map((text, i) => (
          <li key={`${i}-${text}`} className="truncate">
            Sent: {text}
          </li>
        ))}
      </ul>
    </div>
  )
}
