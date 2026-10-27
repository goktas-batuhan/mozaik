import type { AddressChipProps } from './address-chip'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: AddressChipProps }[] = [
  { name: 'bare', title: 'Bare', description: 'Only the shortened address as plain text, with no avatar and no copy button.', props: { address: '0x33cEb14560bd33b977Ada347Daa646D53418F12D', avatar: false, copyable: false } },
]
