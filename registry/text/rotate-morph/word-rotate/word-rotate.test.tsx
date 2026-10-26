import { render, screen } from '@testing-library/react'
import { WordRotate } from './word-rotate'

describe('WordRotate', () => {
  it('exposes every word to assistive tech', () => {
    render(<WordRotate words={['one', 'two', 'three']} />)
    expect(screen.getByText('one, two, three', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('starts on the first word', () => {
    render(<WordRotate words={['one', 'two']} />)
    expect(screen.getByText('one')).toBeInTheDocument()
    expect(screen.queryByText('two')).not.toBeInTheDocument()
  })

  it('shows plain first word when disabled', () => {
    const { container } = render(<WordRotate words={['one', 'two']} disabled />)
    expect(container.textContent).toBe('one')
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(0)
  })

  it('renders the requested element', () => {
    render(<WordRotate as="h1" words={['solo']} />)
    expect(screen.getByRole('heading', { name: 'solo' })).toBeInTheDocument()
  })
})
