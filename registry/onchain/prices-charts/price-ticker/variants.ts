import type { PriceTickerProps } from './price-ticker'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: PriceTickerProps }[] = [
  { name: 'falling', title: 'Falling', description: 'A price below its 24h open, so the change badge reads as a loss.', props: { value: 97615.3, previousValue: 98240.5, currency: 'USD', label: 'Bitcoin price', className: 'text-5xl font-semibold tracking-tight' } },
  { name: 'price-only', title: 'Price only', description: 'Just the rolling digits, with the change badge hidden.', props: { value: 3468.42, currency: 'USD', showChange: false, label: 'Ether price', className: 'text-5xl font-semibold tracking-tight' } },
]
