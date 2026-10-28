import { CtaEmailInline } from './cta-email-inline'

export default function CtaEmailInlineDemo() {
  return (
    <div className="w-full max-w-5xl">
      <CtaEmailInline
        title="Get one good idea a week"
        description="A short letter on design, code and the small decisions that make products feel right."
        footnote="No spam. Unsubscribe any time."
      />
    </div>
  )
}
