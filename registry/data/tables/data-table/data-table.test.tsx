import { fireEvent, render, screen } from '@testing-library/react'
import { DataTable, type DataTableColumn } from './data-table'

interface Row extends Record<string, unknown> {
  name: string
  n: number
}

const rows: Row[] = [
  { name: 'beta', n: 10 },
  { name: 'alpha', n: 9 },
  { name: 'gamma', n: 100 },
]
const columns: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'n', header: 'Count', sortable: true, align: 'right' },
]

const names = () => screen.getAllByRole('row').slice(1).map((r) => r.textContent?.replace(/\d+$/, ''))

describe('DataTable', () => {
  it('renders a captioned table in the original order', () => {
    render(<DataTable columns={columns} rows={rows} caption="Things" />)
    expect(screen.getByRole('table')).toHaveTextContent('Things')
    expect(names()).toEqual(['beta', 'alpha', 'gamma'])
  })

  it('cycles ascending, descending and original order', () => {
    render(<DataTable columns={columns} rows={rows} />)
    const header = screen.getByRole('columnheader', { name: /Name/ })
    const button = screen.getByRole('button', { name: /Name/ })
    fireEvent.click(button)
    expect(header).toHaveAttribute('aria-sort', 'ascending')
    expect(names()).toEqual(['alpha', 'beta', 'gamma'])
    fireEvent.click(button)
    expect(header).toHaveAttribute('aria-sort', 'descending')
    expect(names()).toEqual(['gamma', 'beta', 'alpha'])
    fireEvent.click(button)
    expect(header).toHaveAttribute('aria-sort', 'none')
    expect(names()).toEqual(['beta', 'alpha', 'gamma'])
  })

  it('sorts numbers as numbers', () => {
    render(<DataTable columns={columns} rows={rows} defaultSort={{ key: 'n', direction: 'asc' }} />)
    expect(screen.getAllByRole('row').slice(1).map((r) => r.textContent)).toEqual(['alpha9', 'beta10', 'gamma100'])
  })

  it('follows a controlled sort and reports changes', () => {
    const onSortChange = vi.fn()
    render(<DataTable columns={columns} rows={rows} sort={{ key: 'name', direction: 'desc' }} onSortChange={onSortChange} />)
    expect(names()[0]).toBe('gamma')
    fireEvent.click(screen.getByRole('button', { name: /Count/ }))
    expect(onSortChange).toHaveBeenCalledWith({ key: 'n', direction: 'asc' })
    expect(names()[0]).toBe('gamma')
  })

  it('shows the empty text', () => {
    render(<DataTable columns={columns} rows={[]} empty="Nothing here" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })
})
