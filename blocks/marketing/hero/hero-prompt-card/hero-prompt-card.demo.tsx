import { HeroPromptCard } from './hero-prompt-card'

export default function HeroPromptCardDemo() {
  return (
    <div className="w-full max-w-4xl">
      <HeroPromptCard
        title="Turn rough ideas into clear project briefs"
        description="Let AI handle the planning so you can focus on design, craft and the work your clients actually pay for."
        actionHref="#"
        socialProof={{ label: 'Join 80,000+ designers', people: ['EL', 'NK', 'DP', 'RS'] }}
      />
    </div>
  )
}
