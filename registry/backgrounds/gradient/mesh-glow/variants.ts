import type { MeshGlowProps } from './mesh-glow'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: MeshGlowProps }[] = [
  { name: 'still-glow', title: 'Still glow', description: 'The glows held in place with no drift.', props: { animated: false, className: 'relative h-64 w-[28rem] max-w-full overflow-hidden rounded-xl border bg-background' } },
  { name: 'fast-faint', title: 'Fast and faint', description: 'Dim glows that drift in a quick six-second cycle.', props: { duration: 6, intensity: 0.4, className: 'relative h-64 w-[28rem] max-w-full overflow-hidden rounded-xl border bg-background' } },
]
