import type { OrderBookProps } from './order-book'

// A variant is the same component with a named prop set. Copy the component, then use these props.
const bids = [{price: 3467.9, size: 2.1}, {price: 3467.15, size: 8.4}, {price: 3466.4, size: 6.6}, {price: 3465.65, size: 4.8}, {price: 3464.9, size: 3.0}, {price: 3464.15, size: 1.2}, {price: 3463.4, size: 7.5}, {price: 3462.65, size: 5.7}]
const asks = [{price: 3468.9, size: 4.8}, {price: 3469.65, size: 3.0}, {price: 3470.4, size: 1.2}, {price: 3471.15, size: 7.5}, {price: 3471.9, size: 5.7}, {price: 3472.65, size: 3.9}, {price: 3473.4, size: 2.1}, {price: 3474.15, size: 8.4}]

export const variants: { name: string; title: string; description: string; props: OrderBookProps }[] = [
  { name: 'top-of-book', title: 'Top of book', description: 'Only the three nearest levels on each side, for a compact ticket.', props: { bids, asks, levels: 3, baseSymbol: 'ETH', quoteSymbol: 'USDC', lastPrice: 3468.4 } },
]
