import { render, screen } from '@testing-library/react'
import { FeaturesTerminal } from './features-terminal'

const features = [{ title: 'Deploys', description: 'One command.' }, { title: 'Previews', description: 'Every branch.' }]
const lines = [
  { kind: 'command' as const, text: 'deploy --prod' },
  { text: 'Building...' },
  { kind: 'success' as const, text: 'Done' },
]

describe('FeaturesTerminal', () => {
  it('labels the section with its headline', () => {
    render(<FeaturesTerminal title="CLI" features={features} lines={lines} disabled />)
    expect(screen.getByRole('region', { name: 'CLI' })).toBeInTheDocument()
  })

  it('lists the features with headings', () => {
    render(<FeaturesTerminal title="CLI" features={features} lines={lines} disabled />)
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Deploys', 'Previews'])
  })

  it('prints every line in full when disabled, commands behind a prompt', () => {
    render(<FeaturesTerminal title="CLI" features={features} lines={lines} disabled />)
    expect(screen.getAllByText('$ deploy --prod').length).toBeGreaterThan(0)
    expect(screen.getByText('Building...')).toBeInTheDocument()
  })

  it('colors success lines with the success token', () => {
    render(<FeaturesTerminal title="CLI" features={features} lines={lines} disabled />)
    expect(screen.getByText('Done')).toHaveClass('text-success')
    expect(screen.getByText('Building...')).toHaveClass('text-muted-foreground')
  })

  it('shows the terminal title', () => {
    render(<FeaturesTerminal title="CLI" features={features} lines={lines} terminalTitle="~/app" disabled />)
    expect(screen.getByText('~/app')).toBeInTheDocument()
  })
})
