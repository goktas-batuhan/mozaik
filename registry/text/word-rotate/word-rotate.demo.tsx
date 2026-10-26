import { WordRotate } from './word-rotate'

export default function WordRotateDemo() {
  return (
    <h2 className="flex items-baseline gap-3 text-5xl font-semibold tracking-tight">
      <span>Build something</span>
      <WordRotate words={['calm', 'sharp', 'useful', 'yours']} className="text-primary" />
    </h2>
  )
}
