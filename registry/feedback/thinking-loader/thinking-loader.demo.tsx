import { ThinkingLoader } from './thinking-loader'

export default function ThinkingLoaderDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col gap-5 rounded-xl border bg-card px-8 py-6">
        <ThinkingLoader label="Thinking" variant="dots" />
        <ThinkingLoader label="Searching the web" variant="bar" />
        <ThinkingLoader label="Reading 12 files" variant="grid" />
      </div>
      <ThinkingLoader label="Generating" variant="dots" showElapsed className="text-base text-foreground" />
    </div>
  )
}
