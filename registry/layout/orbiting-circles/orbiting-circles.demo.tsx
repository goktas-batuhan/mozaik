import { Braces, Cpu, Database, Globe, Palette, Zap } from 'lucide-react'
import { OrbitingCircles } from './orbiting-circles'

const iconClass = 'size-full rounded-full border border-border bg-card p-1.5 text-card-foreground'

export default function OrbitingCirclesDemo() {
  return (
    <div className="relative flex h-[26rem] w-[min(34rem,90vw)] items-center justify-center overflow-hidden rounded-2xl border border-border bg-background">
      <div className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
        <Zap aria-label="Mozaik" className="size-7" />
      </div>
      <OrbitingCircles iconSize={40} radius={90} duration={18}>
        <Cpu aria-hidden className={iconClass} />
        <Database aria-hidden className={iconClass} />
        <Globe aria-hidden className={iconClass} />
      </OrbitingCircles>
      <OrbitingCircles iconSize={36} radius={150} duration={26} reverse>
        <Braces aria-hidden className={iconClass} />
        <Palette aria-hidden className={iconClass} />
        <Cpu aria-hidden className={iconClass} />
        <Database aria-hidden className={iconClass} />
      </OrbitingCircles>
    </div>
  )
}
