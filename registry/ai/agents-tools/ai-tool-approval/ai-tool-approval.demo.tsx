import { useState } from 'react'
import { AIToolApproval, type ToolDecision } from './ai-tool-approval'

const CALLS = [
  {
    id: 'test',
    tool: 'bash',
    title: 'Run a command',
    input: 'npm test -- checkout',
    reason: 'Check the checkout tests before changing the form.',
  },
  {
    id: 'clean',
    tool: 'bash',
    title: 'Run a command',
    input: 'rm -rf .next && npm run build',
    reason: 'Clear the stale build cache, then rebuild.',
    destructive: true,
  },
]

export default function AIToolApprovalDemo() {
  const [index, setIndex] = useState(0)
  const [decision, setDecision] = useState<ToolDecision>('pending')
  const call = CALLS[index]

  return (
    <div className="flex w-[min(92vw,440px)] flex-col items-stretch gap-3">
      <AIToolApproval
        key={call.id}
        {...call}
        decision={decision}
        onApprove={() => setDecision('approved')}
        onDeny={() => setDecision('denied')}
      />
      {decision !== 'pending' && (
        <button
          type="button"
          onClick={() => {
            setDecision('pending')
            setIndex((i) => (i + 1) % CALLS.length)
          }}
          className="self-end rounded-md px-2 py-1 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          Next call
        </button>
      )}
    </div>
  )
}
