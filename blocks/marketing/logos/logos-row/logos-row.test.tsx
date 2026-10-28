import { render, screen } from '@testing-library/react'
import { LogosRow } from './logos-row'

const logos = [
  { name: 'Lumen', logo: <svg /> },
  { name: 'Orbit', logo: <svg /> },
]

describe('LogosRow', () => {
  it('renders the label and one list item per logo', () => {
    render(<LogosRow label="Used by" logos={logos} />)
    expect(screen.getByText('Used by')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('exposes company names to assistive tech', () => {
    render(<LogosRow logos={logos} />)
    expect(screen.getByText('Lumen')).toHaveClass('sr-only')
  })

  it('omits the label when null', () => {
    render(<LogosRow label={null} logos={logos} />)
    expect(screen.queryByText('Trusted by')).toBeNull()
  })

  it('uses the element given with as', () => {
    const { container } = render(<LogosRow as="div" logos={logos} />)
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })
})
