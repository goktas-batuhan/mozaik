import { fireEvent, render, screen } from '@testing-library/react'
import { FeaturesAccordionMedia } from './features-accordion-media'

const items = [
  { id: 'a', title: 'Alpha', description: 'Alpha copy.', media: <p>Alpha preview</p> },
  { id: 'b', title: 'Beta', description: 'Beta copy.', media: <p>Beta preview</p> },
]

describe('FeaturesAccordionMedia', () => {
  it('labels the section with its headline', () => {
    render(<FeaturesAccordionMedia title="Team" items={items} />)
    expect(screen.getByRole('region', { name: 'Team' })).toBeInTheDocument()
  })

  it('opens the first row and shows its preview', () => {
    render(<FeaturesAccordionMedia title="Team" items={items} disabled />)
    expect(screen.getByRole('button', { name: 'Alpha' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Alpha copy.')).toBeInTheDocument()
    expect(screen.getByText('Alpha preview')).toBeInTheDocument()
  })

  it('swaps the preview when another row opens', async () => {
    render(<FeaturesAccordionMedia title="Team" items={items} disabled />)
    fireEvent.click(screen.getByRole('button', { name: 'Beta' }))
    expect(await screen.findByText('Beta preview')).toBeInTheDocument()
    expect(screen.queryByText('Alpha preview')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Alpha' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('never closes the open row', () => {
    render(<FeaturesAccordionMedia title="Team" items={items} disabled />)
    fireEvent.click(screen.getByRole('button', { name: 'Alpha' }))
    expect(screen.getByRole('button', { name: 'Alpha' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Alpha preview')).toBeInTheDocument()
  })

  it('starts on the requested row', () => {
    render(<FeaturesAccordionMedia title="Team" items={items} defaultValue="b" disabled />)
    expect(screen.getByText('Beta preview')).toBeInTheDocument()
  })
})
