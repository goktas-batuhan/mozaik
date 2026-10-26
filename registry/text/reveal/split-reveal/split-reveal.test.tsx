import { render, screen } from '@testing-library/react'
import { SplitReveal } from './split-reveal'

const masks = (root: Element) => root.querySelectorAll('.overflow-hidden')

describe('SplitReveal', () => {
  it('exposes the full text to assistive tech', () => {
    render(<SplitReveal text="Hello there world" />)
    expect(screen.getByText('Hello there world', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('gives every word its own mask', () => {
    const { container } = render(<SplitReveal text="one two  three" />)
    expect(masks(container)).toHaveLength(3)
  })

  it('splits into letters, skipping whitespace', () => {
    const { container } = render(<SplitReveal text="ab cd" split="chars" />)
    expect(masks(container)).toHaveLength(4)
  })

  it('renders plain text in the requested element when disabled', () => {
    const { container } = render(<SplitReveal as="h2" text="Title" disabled />)
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument()
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(0)
  })
})
