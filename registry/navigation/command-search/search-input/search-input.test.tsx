import { fireEvent, render, screen } from '@testing-library/react'
import { SearchInput } from './search-input'

describe('SearchInput', () => {
  it('has a hidden but accessible label', () => {
    render(<SearchInput />)
    expect(screen.getByLabelText('Search')).toHaveAttribute('type', 'search')
  })

  it('reports typed text and shows the clear button only with a value', () => {
    const onChange = vi.fn()
    render(<SearchInput onChange={onChange} />)
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull()
    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'mozaik' } })
    expect(onChange).toHaveBeenCalledWith('mozaik', expect.anything())
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument()
  })

  it('clears an uncontrolled field, calls onClear and refocuses the input', () => {
    const onClear = vi.fn()
    render(<SearchInput defaultValue="hello" onClear={onClear} />)
    const input = screen.getByLabelText('Search') as HTMLInputElement
    expect(input.value).toBe('hello')
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(input.value).toBe('')
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(input).toHaveFocus()
  })

  it('shows the error message and links it to the input', () => {
    render(<SearchInput error errorMessage="Too short" hint="Hint text" />)
    const input = screen.getByLabelText('Search')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Too short')
    expect(input.getAttribute('aria-describedby')).toBe(alert.id)
    expect(screen.queryByText('Hint text')).toBeNull()
  })

  it('shows the hint when there is no error', () => {
    render(<SearchInput hint="Search by name" />)
    const hint = screen.getByText('Search by name')
    expect(screen.getByLabelText('Search').getAttribute('aria-describedby')).toBe(hint.id)
  })
})
