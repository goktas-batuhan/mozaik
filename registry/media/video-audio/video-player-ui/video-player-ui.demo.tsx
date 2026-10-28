import { VideoPlayerUI } from './video-player-ui'

// A drawn poster stands in for the clip, so the demo makes no request.
export default function VideoPlayerUIDemo() {
  return (
    <div className="w-[min(94vw,560px)]">
      <VideoPlayerUI duration={132} defaultCurrentTime={38}>
        <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden="true">
          <rect width="320" height="180" className="fill-primary/15" />
          <circle cx="230" cy="55" r="22" className="fill-primary/60" />
          <path d="M0 150 70 80l50 50 60-70 140 110v10H0Z" className="fill-primary/80" />
        </svg>
      </VideoPlayerUI>
    </div>
  )
}
