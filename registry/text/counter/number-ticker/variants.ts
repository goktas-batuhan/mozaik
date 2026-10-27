import type { NumberTickerProps } from './number-ticker'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: NumberTickerProps }[] = [
  { name: 'countdown', title: 'Countdown', description: 'Counts down from the value to a lower start number.', props: { value: 100, startValue: 0, direction: 'down', duration: 3, className: 'text-6xl font-semibold tabular-nums' } },
  { name: 'currency', title: 'Currency', description: 'A slow count to a two-decimal amount with German number formatting.', props: { value: 12489.5, decimalPlaces: 2, locale: 'de-DE', duration: 3, className: 'text-6xl font-semibold tabular-nums' } },
]
