import { ScrollTextReveal } from './scroll-text-reveal'

export default function ScrollTextRevealDemo() {
  return (
    <div className="mx-auto w-[min(760px,calc(100vw-4rem))] py-8">
      <ScrollTextReveal
        text="Good interfaces are read before they are used. Let the words arrive at the pace of the page, one after the other, as you scroll."
        className="text-3xl leading-[1.3] font-semibold text-balance"
      />
    </div>
  )
}
