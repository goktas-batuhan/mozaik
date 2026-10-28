import { fireEvent, render, screen } from '@testing-library/react'
import { Pagination, buildPageRange } from './pagination'

describe('buildPageRange', () => {
  it('shows every page when they fit', () => {
    expect(buildPageRange(1, 5, 1)).toEqual([1, 2, 3, 4, 5])
  })

  it('collapses the far side into an ellipsis', () => {
    expect(buildPageRange(1, 20, 1)).toEqual([1, 2, 'ellipsis', 20])
    expect(buildPageRange(10, 20, 1)).toEqual([1, 'ellipsis', 9, 10, 11, 'ellipsis', 20])
  })
})

describe('Pagination', () => {
  it('renders a nav with the current page marked', () => {
    render(<Pagination page={3} totalPages={5} onPageChange={() => {}} />)
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Go to page 2' })).not.toHaveAttribute('aria-current')
  })

  it('calls onPageChange for a page, previous and next', () => {
    const onPageChange = vi.fn()
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 5' }))
    fireEvent.click(screen.getByRole('button', { name: 'Go to previous page' }))
    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }))
    expect(onPageChange.mock.calls).toEqual([[5], [2], [4]])
  })

  it('disables previous on the first page and next on the last', () => {
    const { rerender } = render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeEnabled()
    rerender(<Pagination page={5} totalPages={5} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled()
  })
})
