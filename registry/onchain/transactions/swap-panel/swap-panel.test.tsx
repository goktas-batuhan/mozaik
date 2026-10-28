import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { SwapPanel, type SwapChain, type SwapToken } from './swap-panel'

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)

const chains: SwapChain[] = [
  { id: 'one', name: 'Chain One', symbol: 'A', tone: 'bg-primary text-primary-foreground' },
  { id: 'two', name: 'Chain Two', symbol: 'B', tone: 'bg-muted text-muted-foreground' },
]
const tokens: SwapToken[] = [
  { id: 'aaa', symbol: 'AAA', name: 'Alpha', chainId: 'one', balance: 5, usd: 100, popular: true },
  { id: 'bbb', symbol: 'BBB', name: 'Beta', chainId: 'two', balance: 20, usd: 50 },
  { id: 'ccc', symbol: 'CCC', name: 'Gamma', chainId: 'two', balance: 3, usd: 10 },
]

const ADDRESS = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'

describe('SwapPanel', () => {
  it('quotes the receive amount from the USD prices', () => {
    still(<SwapPanel chains={chains} tokens={tokens} defaultFromId="aaa" defaultToId="bbb" fee={1.5} slippage={0.3} eta="≈ 9s" />)
    expect(screen.getByText('1 AAA ≈ 2 BBB')).toBeInTheDocument()
    expect(screen.getByText('$1.50')).toBeInTheDocument()
    expect(screen.getByText('0.30%')).toBeInTheDocument()
    expect(screen.getByText('≈ 9s')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'You pay' })).toHaveValue('1')
    fireEvent.change(screen.getByRole('textbox', { name: 'You pay' }), { target: { value: '2.5x' } })
    expect(screen.getByRole('textbox', { name: 'You pay' })).toHaveValue('2.5')
    expect(screen.getByText('5', { selector: 'output' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Swap AAA → BBB' })).toBeEnabled()
  })

  it('reverses direction', async () => {
    still(<SwapPanel chains={chains} tokens={tokens} defaultFromId="aaa" defaultToId="bbb" />)
    fireEvent.click(screen.getByRole('button', { name: 'Reverse direction' }))
    expect(await screen.findByRole('button', { name: 'Swap BBB → AAA' })).toBeInTheDocument()
    expect(screen.getByText('1 BBB ≈ 0.5 AAA')).toBeInTheDocument()
  })

  it('refuses amounts above the balance and fills the balance with Max', async () => {
    still(<SwapPanel chains={chains} tokens={tokens} defaultFromId="aaa" defaultToId="bbb" />)
    fireEvent.change(screen.getByRole('textbox', { name: 'You pay' }), { target: { value: '9' } })
    expect(await screen.findByRole('button', { name: 'Insufficient AAA' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Max' }))
    expect(screen.getByRole('textbox', { name: 'You pay' })).toHaveValue('5')
    expect(await screen.findByRole('button', { name: 'Swap AAA → BBB' })).toBeEnabled()
    fireEvent.change(screen.getByRole('textbox', { name: 'You pay' }), { target: { value: '' } })
    expect(await screen.findByRole('button', { name: 'Enter an amount' })).toBeDisabled()
  })

  it('searches the token list and swaps sides when the other token is picked', async () => {
    still(<SwapPanel chains={chains} tokens={tokens} defaultFromId="aaa" defaultToId="bbb" />)
    fireEvent.click(screen.getByRole('button', { name: /Receive token: BBB/ }))
    const dialog = screen.getByRole('dialog', { name: 'Select receive token' })
    fireEvent.change(within(dialog).getByRole('textbox', { name: 'Search tokens' }), { target: { value: 'gam' } })
    expect(within(dialog).queryByText('Alpha')).toBeNull()
    fireEvent.click(within(dialog).getByRole('button', { name: /Gamma/ }))
    expect(await screen.findByRole('button', { name: 'Swap AAA → CCC' })).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

    // Picking the token already on the other side swaps them instead of duplicating it.
    fireEvent.click(screen.getByRole('button', { name: /Pay token: AAA/ }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /Gamma/ }))
    expect(await screen.findByRole('button', { name: 'Swap CCC → AAA' })).toBeInTheDocument()
  })

  it('validates a different destination address and passes it to onSwap', async () => {
    const onSwap = vi.fn()
    still(<SwapPanel chains={chains} tokens={tokens} defaultFromId="aaa" defaultToId="bbb" onSwap={onSwap} />)
    fireEvent.click(screen.getByRole('button', { name: 'Send to different address' }))
    const input = screen.getByRole('textbox', { name: 'Receiving address' })
    fireEvent.change(input, { target: { value: '0x123' } })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(await screen.findByRole('button', { name: 'Swap AAA → BBB' })).toBeInTheDocument()
    fireEvent.change(input, { target: { value: ADDRESS } })
    expect(input).toHaveAttribute('aria-invalid', 'false')
    const send = await screen.findByRole('button', { name: 'Swap + Send to 0x71C7...976F' })
    fireEvent.click(send)
    expect(onSwap).toHaveBeenCalledWith(expect.objectContaining({ amount: 1, receive: 2, destination: ADDRESS }))
    expect(onSwap.mock.calls[0][0].from.id).toBe('aaa')
    expect(onSwap.mock.calls[0][0].to.id).toBe('bbb')
  })
})
