import { HeroGiantType } from './hero-giant-type'

export default function HeroGiantTypeDemo() {
  return (
    <div className="w-full max-w-5xl">
      <HeroGiantType
        label="Independent web studio"
        words={['Digital', 'Success']}
        description="We are a small full-stack team shaping calm, fast web experiences for brands that want to be remembered."
        services={['Brand identity', 'Web design', 'Development', 'Growth']}
        actionLabel="Book a consultation"
        actionHref="#"
      />
    </div>
  )
}
