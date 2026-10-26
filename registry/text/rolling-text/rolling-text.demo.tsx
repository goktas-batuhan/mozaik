import { RollingText } from './rolling-text'

export default function RollingTextDemo() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <RollingText
        as="h2"
        text="Hover to roll"
        className="text-5xl font-semibold tracking-tight"
      />
      <a
        href="#"
        className="group rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-2"
      >
        <RollingText text="Get started" />
      </a>
    </div>
  )
}
