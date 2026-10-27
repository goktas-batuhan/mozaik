import type { AmountPadProps } from './amount-pad'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: AmountPadProps }[] = [
  { name: 'dollar-prefix', title: 'Dollar prefix', description: 'A currency pad with the symbol in front of the amount and two decimals.', props: { symbol: '$', symbolPosition: 'prefix', decimals: 2, max: 1000, balance: 482.5, presets: [10, 50, 100], actionLabel: 'Pay' } },
  { name: 'whole-units', title: 'Whole units', description: 'A whole-number pad with no decimal key, for tokens that are not divisible.', props: { symbol: 'USDC', symbolPosition: 'suffix', decimals: 0, max: 5000, balance: 1250, presets: [100, 500, 1000] } },
]
