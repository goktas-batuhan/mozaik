import { fireEvent, render, screen } from '@testing-library/react'
import { AISources } from './ai-sources'

const sources = [
  { id: 'a', title: 'First page', url: 'https://www.example.com/a' },
  { id: 'b', title: 'Second page', url: 'https://docs.example.org/b', site: 'Docs' },
]

describe('AISources', () => {
  it('counts the sources on the toggle', () => {
    const { rerender } = render(<AISources sources={sources} />)
    expect(screen.getByRole('button', { name: 'Used 2 sources' })).toHaveAttribute('aria-expanded', 'false')
    rerender(<AISources sources={sources.slice(0, 1)} />)
    expect(screen.getByRole('button', { name: 'Used 1 source' })).toBeInTheDocument()
  })

  it('opens into links that use a new tab safely', async () => {
    render(<AISources sources={sources} />)
    fireEvent.click(screen.getByRole('button'))
    const link = await screen.findByRole('link', { name: /First page/ })
    expect(link).toHaveAttribute('href', 'https://www.example.com/a')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('shows the site name or falls back to the host', () => {
    render(<AISources sources={sources} defaultOpen />)
    expect(screen.getByText('example.com')).toBeInTheDocument()
    expect(screen.getByText('Docs')).toBeInTheDocument()
  })

  it('can be controlled', () => {
    const onOpenChange = vi.fn()
    render(<AISources sources={sources} open={false} onOpenChange={onOpenChange} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole('list')).toBeNull()
  })

  it('renders nothing without sources', () => {
    const { container } = render(<AISources sources={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
