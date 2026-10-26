import { MorphingText } from './morphing-text'

export default function MorphingTextDemo() {
  return (
    <MorphingText
      words={['Mozaik', 'Motion', 'Craft', 'Detail']}
      className="text-6xl font-bold tracking-tight sm:text-8xl"
    />
  )
}
