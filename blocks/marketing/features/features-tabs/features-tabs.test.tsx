import { fireEvent, render, screen } from '@testing-library/react'
import { FeaturesTabs } from './features-tabs'

const tabs = [
  { id: 'a', label: 'Alpha', title: 'Alpha title', description: 'Alpha copy.', points: ['One', 'Two'], visual: <i data-testid="va" /> },
  { id: 'b', label: 'Beta', title: 'Beta title', description: 'Beta copy.' },
]

describe('FeaturesTabs', () => {
  it('labels the section and renders one tab per feature', () => {
    render(<FeaturesTabs title="Workflows" tabs={tabs} />)
    expect(screen.getByRole('region', { name: 'Workflows' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['Alpha', 'Beta'])
  })

  it('shows the first panel with its bullets and visual', () => {
    render(<FeaturesTabs title="Workflows" tabs={tabs} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Alpha title' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByTestId('va')).toBeInTheDocument()
  })

  it('switches panel when another tab is clicked', async () => {
    render(<FeaturesTabs title="Workflows" tabs={tabs} disabled />)
    fireEvent.click(screen.getByRole('tab', { name: 'Beta' }))
    expect(await screen.findByRole('heading', { level: 3, name: 'Beta title' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true')
  })

  it('opens on the requested tab and moves with the arrow keys', () => {
    render(<FeaturesTabs title="Workflows" tabs={tabs} defaultValue="b" disabled />)
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowLeft' })
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true')
  })
})
