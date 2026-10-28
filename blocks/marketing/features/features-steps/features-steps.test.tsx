import { render, screen, within } from '@testing-library/react'
import { FeaturesSteps } from './features-steps'

const steps = [
  { title: 'Pick', description: 'Choose one.', visual: <button>Snippet</button> },
  { title: 'Add', description: 'Install it.' },
  { title: 'Ship', description: 'Done.' },
]

describe('FeaturesSteps', () => {
  it('labels the section with its headline', () => {
    render(<FeaturesSteps title="How it works" steps={steps} />)
    expect(screen.getByRole('region', { name: 'How it works' })).toBeInTheDocument()
  })

  it('renders an ordered list with one item per step', () => {
    render(<FeaturesSteps title="How it works" steps={steps} />)
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(within(items[0]).getByText('Choose one.')).toBeInTheDocument()
  })

  it('gives each step a spoken number in its heading', () => {
    render(<FeaturesSteps title="How it works" steps={steps} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Step 2: Add' })).toBeInTheDocument()
  })

  it('shows the visual of a step and no rail after the last one', () => {
    const { container } = render(<FeaturesSteps title="How it works" steps={steps} />)
    expect(screen.getByRole('button', { name: 'Snippet' })).toBeInTheDocument()
    expect(container.querySelectorAll('li > span[aria-hidden].w-px')).toHaveLength(2)
  })
})
