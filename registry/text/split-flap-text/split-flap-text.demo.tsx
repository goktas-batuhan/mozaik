import { SplitFlapText } from './split-flap-text'

export default function SplitFlapTextDemo() {
  return (
    <SplitFlapText
      words={['Now boarding', 'Gate 12', 'On time', 'Last call']}
      className="text-4xl sm:text-6xl"
    />
  )
}
