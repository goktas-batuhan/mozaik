import { SpoilerText } from './spoiler-text'

export default function SpoilerTextDemo() {
  return (
    <p className="max-w-md text-xl leading-8">
      Don&apos;t read ahead. In the finale,{' '}
      <SpoilerText className="font-medium text-primary">
        the lighthouse keeper had been writing the letters all along
      </SpoilerText>
      , and nobody saw it coming.
    </p>
  )
}
