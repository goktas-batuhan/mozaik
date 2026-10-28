import { AITypingIndicator } from './ai-typing-indicator'

export default function AITypingIndicatorDemo() {
  return (
    <div className="flex w-[min(92vw,320px)] flex-col items-start gap-3">
      <AITypingIndicator />
      <AITypingIndicator name="Ada" dots={4} duration={1.2} />
    </div>
  )
}
