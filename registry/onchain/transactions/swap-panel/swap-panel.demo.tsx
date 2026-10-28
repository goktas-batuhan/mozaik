import { useState } from 'react'
import { SwapPanel, type SwapChain, type SwapRequest, type SwapToken } from './swap-panel'

// Local sample data: no network, no wallet.
const CHAINS: SwapChain[] = [
  { id: 'eth', name: 'Ethereum', symbol: 'Ξ', tone: 'bg-primary text-primary-foreground' },
  { id: 'sol', name: 'Solana', symbol: '◎', tone: 'bg-foreground text-background' },
  { id: 'base', name: 'Base', symbol: 'B', tone: 'bg-muted text-muted-foreground' },
  { id: 'arb', name: 'Arbitrum', symbol: 'A', tone: 'bg-destructive text-primary-foreground' },
]

const TOKENS: SwapToken[] = [
  { id: 'eth-eth', symbol: 'ETH', name: 'Ether', chainId: 'eth', balance: 1.245, usd: 3142, popular: true },
  { id: 'eth-usdc', symbol: 'USDC', name: 'USD Coin', chainId: 'eth', balance: 4521, usd: 1, popular: true },
  { id: 'eth-wbtc', symbol: 'WBTC', name: 'Wrapped Bitcoin', chainId: 'eth', balance: 0.04, usd: 96000, popular: true },
  { id: 'eth-link', symbol: 'LINK', name: 'Chainlink', chainId: 'eth', balance: 120, usd: 22, address: '0x51...86ca' },
  { id: 'sol-sol', symbol: 'SOL', name: 'Solana', chainId: 'sol', balance: 12.4, usd: 168, popular: true },
  { id: 'sol-usdc', symbol: 'USDC', name: 'USD Coin', chainId: 'sol', balance: 985.32, usd: 1 },
  { id: 'base-eth', symbol: 'ETH', name: 'Ether', chainId: 'base', balance: 0.65, usd: 3142 },
  { id: 'base-usdc', symbol: 'USDC', name: 'USD Coin', chainId: 'base', balance: 1200, usd: 1 },
  { id: 'arb-arb', symbol: 'ARB', name: 'Arbitrum', chainId: 'arb', balance: 800, usd: 0.95 },
]

export default function SwapPanelDemo() {
  const [last, setLast] = useState<SwapRequest | null>(null)
  return (
    <div className="flex w-[min(92vw,420px)] flex-col items-center gap-3">
      <SwapPanel chains={CHAINS} tokens={TOKENS} defaultFromId="eth-eth" defaultToId="sol-sol" onSwap={setLast} />
      <p aria-live="polite" className="min-h-4 text-center text-xs text-muted-foreground">
        {last ? `Requested ${last.amount} ${last.from.symbol} → ${last.receive.toFixed(4)} ${last.to.symbol} (demo only, nothing is sent)` : 'Demo data only: nothing is sent.'}
      </p>
    </div>
  )
}
