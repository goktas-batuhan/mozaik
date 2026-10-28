import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ActionSearchBar, fuzzyMatch, type CommandItem } from './action-search-bar'

const items: CommandItem[] = [
  { id: 'new', label: 'New document', group: 'Actions', keywords: ['create'] },
  { id: 'dup', label: 'Duplicate page', group: 'Actions', keywords: ['clone'] },
  {
    id: 'move',
    label: 'Move to…',
    group: 'Actions',
    placeholder: 'Pick a folder',
    children: [
      { id: 'inbox', label: 'Inbox' },
      { id: 'archive', label: 'Archive' },
    ],
  },
  { id: 'docs', label: 'Documentation', group: 'Links', href: '/docs' },
]

const input = () => screen.getByRole('combobox', { name: 'Search commands' })

describe('fuzzyMatch', () => {
  it('matches subsequences, prefers contiguous runs and rejects misses', () => {
    expect(fuzzyMatch('Duplicate page', 'dup')?.matches).toEqual([0, 1, 2])
    expect(fuzzyMatch('New document', 'ndc')).not.toBeNull()
    expect(fuzzyMatch('New document', 'xyz')).toBeNull()
    expect(fuzzyMatch('Anything', '')).toEqual({ score: 0, matches: [] })
  })
})

describe('ActionSearchBar', () => {
  it('starts closed and opens a grouped listbox with the arrow keys', () => {
    render(<ActionSearchBar items={items} />)
    expect(input()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).toBeNull()
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(input()).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox', { name: 'Commands' })).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(4)
    expect(screen.getAllByRole('group')).toHaveLength(2)
  })

  it('moves the highlighted option and points aria-activedescendant at it', () => {
    render(<ActionSearchBar items={items} />)
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(screen.getAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true')
    expect(input().getAttribute('aria-activedescendant')).toBe(screen.getAllByRole('option')[1].id)
  })

  it('filters by fuzzy label or keyword and shows an empty state', () => {
    render(<ActionSearchBar items={items} />)
    fireEvent.change(input(), { target: { value: 'clone' } })
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option')).toHaveTextContent('Duplicate page')
    fireEvent.change(input(), { target: { value: 'zzzz' } })
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByText(/No results for/)).toBeInTheDocument()
  })

  it('runs the highlighted row with Enter, then closes', async () => {
    const onSelect = vi.fn()
    render(<ActionSearchBar items={items} onSelect={onSelect} />)
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    fireEvent.keyDown(input(), { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith(items[0], [])
    await waitFor(() => expect(input()).toHaveAttribute('aria-expanded', 'false'))
  })

  it('opens a nested page, goes back with Backspace and closes with Escape', () => {
    render(<ActionSearchBar items={items} />)
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    fireEvent.change(input(), { target: { value: 'move' } })
    fireEvent.keyDown(input(), { key: 'Enter' })
    expect(input()).toHaveAttribute('placeholder', 'Pick a folder')
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Inbox', 'Archive'])
    fireEvent.keyDown(input(), { key: 'Backspace' })
    expect(screen.getAllByRole('option')).toHaveLength(4)
    fireEvent.keyDown(input(), { key: 'Escape' })
    expect(input()).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows progress while a returned promise is pending', async () => {
    let resolve!: () => void
    const pending = new Promise<void>((r) => {
      resolve = r
    })
    render(<ActionSearchBar items={items} onSelect={() => pending} />)
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    fireEvent.keyDown(input(), { key: 'Enter' })
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'true')
    resolve()
    await waitFor(() => expect(input()).toHaveAttribute('aria-expanded', 'false'))
  })
})
