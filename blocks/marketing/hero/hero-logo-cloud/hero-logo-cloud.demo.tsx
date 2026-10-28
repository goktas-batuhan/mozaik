import { HeroLogoCloud } from './hero-logo-cloud'

export default function HeroLogoCloudDemo() {
  return (
    <div className="w-full max-w-5xl">
      <HeroLogoCloud
        title={['The infrastructure behind', 'your next generation of AI']}
        description="High-quality data, scalable tooling and reliable pipelines, so your team trains models instead of wrangling servers."
        primaryAction={{ label: 'Register for free', href: '#' }}
        secondaryAction={{ label: 'Talk to sales', href: '#' }}
        logosLabel="Trusted by teams at"
        logos={['Northwind', 'Lumen', 'Orbital', 'Vertex', 'Halcyon']}
      />
    </div>
  )
}
