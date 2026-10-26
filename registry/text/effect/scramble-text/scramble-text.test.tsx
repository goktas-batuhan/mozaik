import { render, screen, waitFor } from '@testing-library/react'
import { ScrambleText } from './scramble-text'

/** The glyphs a sighted user sees (the invisible width holders are skipped). */
const visible = (root: Element) =>
  Array.from(root.querySelectorAll('.absolute'))
    .map((n) => n.textContent)
    .join('')

describe('ScrambleText', () => {
  it('exposes the full text to assistive tech', () => {
    render(<ScrambleText text="Hello world" />)
    expect(screen.getByText('Hello world', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('starts from the glyph set and settles on the real text', async () => {
    const { container } = render(<ScrambleText text="ABC" characters="x" duration={0.1} />)
    expect(visible(container)).toBe('xxx')
    await waitFor(() => expect(visible(container)).toBe('ABC'))
  })

  it('renders plain text when disabled', () => {
    const { container } = render(<ScrambleText text="Hello" disabled />)
    expect(container.textContent).toBe('Hello')
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(0)
  })

  it('shows the real text before hover', () => {
    const { container } = render(<ScrambleText as="h2" text="Title" trigger="hover" />)
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument()
    expect(visible(container)).toBe('Title')
  })
})
