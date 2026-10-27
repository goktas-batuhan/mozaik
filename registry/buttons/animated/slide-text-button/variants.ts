import type { SlideTextButtonProps } from './slide-text-button'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: {
  name: string
  title: string
  description: string
  props: SlideTextButtonProps
}[] = [
  {
    name: 'ghost',
    title: 'Ghost',
    description: 'A borderless button that slides its label up to reveal the hover text, with no filled background.',
    props: {
      text: 'Read the docs',
      hoverText: 'Start reading',
      variant: 'ghost',
    },
  },
]
