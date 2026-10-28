import { render, screen } from '@testing-library/react'
import { LaptopMockup } from './laptop-mockup'

describe('LaptopMockup', () => {
  it('puts children in a named screen region', () => {
    render(<LaptopMockup screenLabel="Product demo"><p>Hello</p></LaptopMockup>)
    expect(screen.getByRole('region', { name: 'Product demo' })).toContainElement(screen.getByText('Hello'))
  })

  it('uses a 16:10 screen and a default label', () => {
    render(<LaptopMockup />)
    expect(screen.getByRole('region', { name: 'Laptop screen' }).style.aspectRatio).toBe('16 / 10')
  })

  it('hides the base and forwards className', () => {
    const { container } = render(<LaptopMockup className="max-w-xs" />)
    expect(container.firstElementChild).toHaveClass('max-w-xs')
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })
})
