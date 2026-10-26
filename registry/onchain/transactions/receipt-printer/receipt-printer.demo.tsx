import { ReceiptPrinter } from './receipt-printer'

export default function ReceiptPrinterDemo() {
  return (
    <ReceiptPrinter
      tx={{
        hash: '0x8f3a1c52d9e47b60a1f3c8d25e9b7a4c6d01f2e3b4a5968778695a4b3c2d1e0f',
        from: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        to: '0x2a9fB1c0E5d3a7C8b4F6e1D2c9A0b3E7f5d4C6B8',
        amount: '0.2500',
        symbol: 'ETH',
        fee: '0.00042',
        status: 'confirmed',
        network: 'Ethereum',
        timestamp: '26 Oct 2026 · 08:42',
      }}
    />
  )
}
