import { AIToolCall } from './ai-tool-call'

export default function AIToolCallDemo() {
  return (
    <div className="flex w-[min(92vw,440px)] flex-col gap-2">
      <AIToolCall
        name="search_docs"
        status="success"
        summary="3 results"
        defaultOpen
        args={<code>{'{ "query": "reduced motion" }'}</code>}
        result="Found: MotionConfig, useReducedMotion, the playground toggle."
      />
      <AIToolCall name="run_tests" status="running" summary="2.4s" />
      <AIToolCall name="write_file" status="error" summary="denied" args={<code>src/app.tsx</code>} result="Permission denied." />
      <AIToolCall name="open_pr" status="pending" />
    </div>
  )
}
