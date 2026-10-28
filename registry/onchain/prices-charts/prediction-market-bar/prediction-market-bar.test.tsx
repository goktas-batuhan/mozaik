import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { PredictionMarketBar } from './prediction-market-bar'

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)

describe('PredictionMarketBar', () => {
  it('shows the question, the chance and both share prices', () => {
    still(<PredictionMarketBar question="Will it rain?" yes={0.62} />)
    expect(screen.getByRole('heading', { name: 'Will it rain?' })).toBeInTheDocument()
    expect(screen.getByText('62%')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buy Yes 62¢' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buy No 38¢' })).toBeInTheDocument()
  })

  it('exposes the odds as a meter', () => {
    still(<PredictionMarketBar question="q" yes={0.3} />)
    expect(screen.getByRole('meter', { name: 'Probability of Yes' })).toHaveAttribute('aria-valuenow', '30')
  })

  it('reports the side that was pressed and sends nothing else', () => {
    const onTrade = vi.fn()
    still(<PredictionMarketBar question="q" yes={0.5} onTrade={onTrade} />)
    fireEvent.click(screen.getByRole('button', { name: /Buy No/ }))
    fireEvent.click(screen.getByRole('button', { name: /Buy Yes/ }))
    expect(onTrade.mock.calls).toEqual([['no'], ['yes']])
  })

  it('clamps the probability and survives bad input', () => {
    const { rerender } = still(<PredictionMarketBar question="q" yes={4} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
    rerender(<MotionConfig reducedMotion="always"><PredictionMarketBar question="q" yes={Number.NaN} /></MotionConfig>)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('shows volume and the close line when given', () => {
    still(<PredictionMarketBar question="q" yes={0.5} volume="$2M" closes="Closes Jan 1" />)
    expect(screen.getByText('$2M vol.')).toBeInTheDocument()
    expect(screen.getByText('Closes Jan 1')).toBeInTheDocument()
  })
})
