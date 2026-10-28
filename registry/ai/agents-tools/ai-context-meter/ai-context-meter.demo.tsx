import { AIContextMeter } from './ai-context-meter'

const BREAKDOWN = [
  { label: 'System prompt', tokens: 2400 },
  { label: 'Conversation', tokens: 61000 },
  { label: 'Tool results', tokens: 38500 },
]

export default function AIContextMeterDemo() {
  return (
    <div className="flex w-[min(92vw,320px)] flex-col items-start gap-3 pt-28">
      <AIContextMeter used={101900} limit={200000} breakdown={BREAKDOWN} />
      <AIContextMeter used={170000} limit={200000} />
      <AIContextMeter used={197000} limit={200000} />
    </div>
  )
}
