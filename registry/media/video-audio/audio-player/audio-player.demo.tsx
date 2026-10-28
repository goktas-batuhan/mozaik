import { AudioPlayer } from './audio-player'

// No audio file is loaded: the player keeps its own clock, so the demo makes no request.
export default function AudioPlayerDemo() {
  return (
    <div className="w-[min(94vw,420px)]">
      <AudioPlayer title="Blue Hour" artist="Mozaik Ensemble" duration={214} defaultCurrentTime={74} />
    </div>
  )
}
