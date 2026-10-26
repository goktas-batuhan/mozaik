import { WaveText } from './wave-text'

export default function WaveTextDemo() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <WaveText as="h2" text="Ride the wave" className="text-6xl font-semibold tracking-tight" />
      <WaveText
        text="Every letter moves a little later than the last"
        amplitude={5}
        duration={1.8}
        className="text-lg text-muted-foreground"
      />
    </div>
  )
}
