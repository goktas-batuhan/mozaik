import type { MarqueeProps } from './marquee'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: MarqueeProps }[] = [
  {
    name: 'vertical',
    title: 'Vertical',
    description: 'The text loop scrolls upward inside a fixed-height box.',
    props: { vertical: true, repeat: 3, duration: 14, className: 'h-48 w-64 max-w-full', children: 'Copy it. Paste it. Own it.' },
  },
  {
    name: 'reverse',
    title: 'Reverse',
    description: 'The text loop runs left to right and pauses on hover.',
    props: { reverse: true, pauseOnHover: true, repeat: 4, duration: 20, className: 'w-[28rem] max-w-full', children: 'Quiet motion. Tokens first. Reduced motion is a first-class state.' },
  },
]
