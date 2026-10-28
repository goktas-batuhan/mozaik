import { render, screen } from '@testing-library/react'
import { SafariMockup } from './safari-mockup'

describe('SafariMockup', () => {
  it('shows the address and the page content', () => {
    render(<SafariMockup url="example.com/pricing"><p>Plans</p></SafariMockup>)
    expect(screen.getByText('example.com/pricing')).toBeInTheDocument()
    expect(screen.getByText('Plans')).toBeInTheDocument()
  })

  it('falls back to the default address', () => {
    render(<SafariMockup />)
    expect(screen.getByText('mozaik.dev')).toBeInTheDocument()
  })

  it('hides the toolbar chrome from assistive tech and can drop the buttons', () => {
    const { container } = render(<SafariMockup hideControls />)
    const lights = container.querySelector('div[aria-hidden="true"]') as HTMLElement
    expect(lights).toHaveClass('invisible')
    expect(lights.querySelectorAll('span')).toHaveLength(3)
  })

  it('merges className and forwards props', () => {
    render(<SafariMockup data-testid="win" className="h-40" />)
    expect(screen.getByTestId('win')).toHaveClass('h-40')
  })
})
