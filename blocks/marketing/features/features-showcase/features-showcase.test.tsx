import { render, screen, within } from '@testing-library/react'
import { FeaturesShowcase } from './features-showcase'

const left = [{ title: 'Fast', description: 'Quick.', icon: <svg data-testid="icon" /> }, { title: 'Offline', description: 'Anywhere.' }]
const right = [{ title: 'Secure', description: 'Locked.' }]

describe('FeaturesShowcase', () => {
  it('labels the section with its headline', () => {
    render(<FeaturesShowcase title="Mobile" media={<img alt="App" />} left={left} right={right} />)
    expect(screen.getByRole('region', { name: 'Mobile' })).toBeInTheDocument()
  })

  it('renders the media and every callout', () => {
    render(<FeaturesShowcase title="Mobile" media={<img alt="App" />} left={left} right={right} />)
    expect(screen.getByAltText('App')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Fast', 'Offline', 'Secure'])
  })

  it('keeps the left and right callouts in separate lists', () => {
    render(<FeaturesShowcase title="Mobile" media={<img alt="App" />} left={left} right={right} />)
    const [l, r] = screen.getAllByRole('list')
    expect(within(l).getAllByRole('listitem')).toHaveLength(2)
    expect(within(r).getAllByRole('listitem')).toHaveLength(1)
  })

  it('hides decorative icons from assistive tech', () => {
    render(<FeaturesShowcase title="Mobile" media={<img alt="App" />} left={left} right={right} />)
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
  })
})
