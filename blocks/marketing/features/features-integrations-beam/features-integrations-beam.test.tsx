import { render, screen } from '@testing-library/react'
import { FeaturesIntegrationsBeam } from './features-integrations-beam'

const sources = [{ label: 'Docs', icon: 'D' }, { label: 'Mail', icon: 'M' }]
const targets = [{ label: 'Git', icon: 'G' }]

describe('FeaturesIntegrationsBeam', () => {
  it('labels the section with its headline', () => {
    render(<FeaturesIntegrationsBeam title="Connect" sources={sources} targets={targets} hub="H" />)
    expect(screen.getByRole('region', { name: 'Connect' })).toBeInTheDocument()
  })

  it('names every node for assistive tech', () => {
    render(<FeaturesIntegrationsBeam title="Connect" sources={sources} targets={targets} hub="H" hubLabel="Core" />)
    for (const name of ['Docs', 'Mail', 'Git', 'Core']) expect(screen.getByRole('img', { name })).toBeInTheDocument()
  })

  it('lists the selling points', () => {
    render(<FeaturesIntegrationsBeam title="Connect" sources={sources} targets={targets} hub="H" points={['Fast', 'Safe']} />)
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Fast', 'Safe'])
  })

  it('draws one beam per source and target, and stops the light when disabled', () => {
    const { container, rerender } = render(<FeaturesIntegrationsBeam title="Connect" sources={sources} targets={targets} hub="H" />)
    expect(container.querySelectorAll('svg')).toHaveLength(3)
    expect(container.querySelectorAll('linearGradient')).toHaveLength(3)
    rerender(<FeaturesIntegrationsBeam title="Connect" sources={sources} targets={targets} hub="H" disabled />)
    expect(container.querySelectorAll('svg')).toHaveLength(3)
    expect(container.querySelectorAll('linearGradient')).toHaveLength(0)
  })
})
