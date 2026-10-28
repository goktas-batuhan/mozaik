import { SpeechBubble } from './speech-bubble'

export default function SpeechBubbleDemo() {
  return (
    <div className="flex flex-col items-start gap-8 py-4">
      <SpeechBubble>Your signal bot is live.</SpeechBubble>
      <SpeechBubble showCursor={false}>Whale alert: 4,200 ETH moved.</SpeechBubble>
    </div>
  )
}
