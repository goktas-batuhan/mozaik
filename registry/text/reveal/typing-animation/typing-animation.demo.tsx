import { TypingAnimation } from './typing-animation'

export default function TypingAnimationDemo() {
  return (
    <div className="flex w-[min(40rem,90vw)] flex-col items-center gap-6 text-center">
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">Now typing</p>
      <h2 className="min-h-[1.2em] text-5xl font-semibold tracking-tight">
        <TypingAnimation
          startOnView={false}
          loop
          pause={1.4}
          words={['Design systems', 'Motion that behaves', 'Components you own']}
        />
      </h2>
      <p className="text-muted-foreground">
        <TypingAnimation startOnView={false} delay={0.4} duration={0.03} cursorStyle="underscore">
          One sentence, typed once, left alone afterwards.
        </TypingAnimation>
      </p>
    </div>
  )
}
