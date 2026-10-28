import { fireEvent, render, screen } from '@testing-library/react'
import { FaviconSearch, type FaviconSearchResult } from './favicon-search'

const results: FaviconSearchResult[] = [
  { id: 'a', title: 'Alpha Docs', url: 'https://alpha.test', description: 'Alpha guide' },
  { id: 'b', title: 'Beta Blog', url: 'https://beta.test' },
  { id: 'c', title: 'Gamma Shop', url: 'https://gamma.test' },
]

describe('FaviconSearch', () => {
  it('exposes a combobox that opens a listbox on focus', () => {
    render(<FaviconSearch results={results} />)
    const input = screen.getByRole('combobox', { name: 'Search' })
    expect(input).toHaveAttribute('aria-expanded', 'false')
    fireEvent.focus(input)
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox', { name: 'Search results' })).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('moves the active option with arrow keys and selects with Enter', () => {
    const onSelect = vi.fn()
    render(<FaviconSearch results={results} onSelect={onSelect} />)
    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    const options = screen.getAllByRole('option')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
    expect(input.getAttribute('aria-activedescendant')).toBe(options[1].id)
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith(results[1])
  })

  it('closes on Escape and wraps around with ArrowUp', () => {
    render(<FaviconSearch results={results} />)
    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(screen.getAllByRole('option')[2]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('reports typed text, limits rows and highlights the match', () => {
    const onValueChange = vi.fn()
    render(<FaviconSearch results={results} maxResults={2} onValueChange={onValueChange} />)
    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    expect(screen.getAllByRole('option')).toHaveLength(2)
    fireEvent.change(input, { target: { value: 'alp' } })
    expect(onValueChange).toHaveBeenCalledWith('alp')
    expect(screen.getAllByText('Alp', { selector: 'mark' }).length).toBeGreaterThan(0)
  })

  it('shows the empty message for a query without results', () => {
    render(<FaviconSearch results={[]} value="zzz" emptyMessage="Nothing here" />)
    fireEvent.focus(screen.getByRole('combobox'))
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('shows skeleton rows and announces loading', () => {
    render(<FaviconSearch results={results} loading />)
    fireEvent.focus(screen.getByRole('combobox'))
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByRole('status')).toHaveTextContent('Loading results')
  })
})
