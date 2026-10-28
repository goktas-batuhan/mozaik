import { render, screen } from '@testing-library/react'
import { StatsBand } from './stats-band'

const stats = [
  { value: 120, suffix: '+', label: 'Components' },
  { value: 99.9, suffix: '%', decimalPlaces: 1, label: 'Coverage' },
  { value: 4, prefix: '~', label: 'Years' },
]

describe('StatsBand', () => {
  it('names the band for assistive tech with a hidden heading', () => {
    render(<StatsBand title="In numbers" stats={stats} />)
    expect(screen.getByRole('region', { name: 'In numbers' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'In numbers' })).toHaveClass('sr-only')
  })

  it('renders a term for every label', () => {
    render(<StatsBand title="In numbers" stats={stats} />)
    expect(screen.getAllByRole('term').map((t) => t.textContent)).toEqual(['Components', 'Coverage', 'Years'])
  })

  it('formats the final numbers for screen readers', () => {
    render(<StatsBand title="In numbers" stats={stats} />)
    expect(screen.getByText('120', { selector: '.sr-only' })).toBeInTheDocument()
    expect(screen.getByText('99.9', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('keeps the prefix and suffix around the number', () => {
    const { container } = render(<StatsBand title="In numbers" stats={stats} disabled />)
    const values = [...container.querySelectorAll('dd')].map((d) => d.textContent)
    expect(values).toEqual(['120120+', '99.999.9%', '~44'])
  })
})
