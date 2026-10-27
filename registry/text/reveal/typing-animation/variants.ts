import type { TypingAnimationProps } from './typing-animation'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: TypingAnimationProps }[] = [
  { name: 'block-cursor', title: 'Block cursor', description: 'Types and deletes several phrases with a solid terminal block cursor.', props: { words: ['npx shadcn add', 'npm run dev', 'git push'], loop: true, cursorStyle: 'block', startOnView: false, className: 'font-mono text-4xl font-semibold' } },
  { name: 'quick-no-cursor', title: 'Quick, no cursor', description: 'Types one line very fast with the cursor hidden.', props: { children: 'Typed in a blink, with no cursor in sight.', duration: 0.015, showCursor: false, startOnView: false, className: 'text-2xl' } },
]
