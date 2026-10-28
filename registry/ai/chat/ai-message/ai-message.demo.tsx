import { useState } from 'react'
import { AIMessage } from './ai-message'

export default function AIMessageDemo() {
  const [vote, setVote] = useState<string>('')
  const reply = 'Short answer: yes. Keep the animation in a transform so the browser can skip layout.'

  return (
    <div className="flex w-[min(92vw,460px)] flex-col gap-3">
      <AIMessage from="user" timestamp="14:31">
        Is it safe to animate the sidebar width?
      </AIMessage>
      <AIMessage timestamp="14:32" copyText={reply} onRetry={() => setVote('')} onVote={(v) => setVote(v)}>
        {reply}
      </AIMessage>
      <p className="px-1 text-xs text-muted-foreground" aria-live="polite">
        {vote ? `Feedback: ${vote}` : 'Hover or focus a message for actions.'}
      </p>
    </div>
  )
}
