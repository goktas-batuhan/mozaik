import type { ReceiptPrinterProps } from './receipt-printer'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: ReceiptPrinterProps }[] = [
  { name: 'manual-print', title: 'Manual print', description: 'The paper stays in the printer until the Print button is pressed.', props: { autoPrint: false, tx: { hash: '0x8f3a1c52d9e47b60a1f3c8d25e9b7a4c6d01f2e3b4a5968778695a4b3c2d1e0f', from: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', to: '0x2a9fB1c0E5d3a7C8b4F6e1D2c9A0b3E7f5d4C6B8', amount: '0.2500', symbol: 'ETH', fee: '0.00042', status: 'confirmed', network: 'Ethereum', timestamp: '26 Oct 2026 · 08:42' } } },
  { name: 'failed', title: 'Failed', description: 'A receipt for a transaction that failed on chain.', props: { tx: { hash: '0x8f3a1c52d9e47b60a1f3c8d25e9b7a4c6d01f2e3b4a5968778695a4b3c2d1e0f', from: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', to: '0x2a9fB1c0E5d3a7C8b4F6e1D2c9A0b3E7f5d4C6B8', amount: '0.2500', symbol: 'ETH', fee: '0.00042', status: 'failed', network: 'Ethereum', timestamp: '26 Oct 2026 · 08:42' } } },
]
