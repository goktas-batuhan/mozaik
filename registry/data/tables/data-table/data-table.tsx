// Source: original
import { useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type SortDirection = 'asc' | 'desc'

export interface DataTableColumn<T> {
  /** Key of the field to show and sort by. */
  key: keyof T & string
  /** Column heading. */
  header: string
  /** Text alignment. Numbers usually go right. */
  align?: 'left' | 'right' | 'center'
  /** Let the reader sort by this column. */
  sortable?: boolean
  /** Custom cell content. */
  render?: (row: T) => ReactNode
}

export interface DataTableSort {
  key: string
  direction: SortDirection
}

export interface DataTableProps<T> {
  /** The columns, left to right. */
  columns: DataTableColumn<T>[]
  /** The rows. */
  rows: T[]
  /** A stable id for each row. Defaults to the row's index. */
  getRowId?: (row: T, index: number) => string
  /** Controlled sort. */
  sort?: DataTableSort | null
  /** Initial sort when you do not control it. */
  defaultSort?: DataTableSort | null
  /** Called when the reader changes the sort. */
  onSortChange?: (sort: DataTableSort | null) => void
  /** Visible caption, also the table's accessible name. */
  caption?: string
  /** Tighter rows. */
  dense?: boolean
  /** Text for an empty table. */
  empty?: string
  className?: string
}

const ALIGN = { left: 'text-left', right: 'text-right', center: 'text-center' }

function compare(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a ?? '').localeCompare(String(b ?? ''), 'en', { numeric: true, sensitivity: 'base' })
}

/** A sortable table. Click a heading or press Enter on it: ascending, descending, then back to the original order. */
export function DataTable<T extends Record<string, unknown>>({ columns, rows, getRowId, sort, defaultSort = null, onSortChange, caption, dense = false, empty = 'No data', className }: DataTableProps<T>) {
  const [inner, setInner] = useState<DataTableSort | null>(defaultSort)
  const current = sort === undefined ? inner : sort

  const change = (key: string) => {
    const next: DataTableSort | null = current?.key !== key ? { key, direction: 'asc' } : current.direction === 'asc' ? { key, direction: 'desc' } : null
    if (sort === undefined) setInner(next)
    onSortChange?.(next)
  }

  const sorted = current ? [...rows].sort((a, b) => compare(a[current.key], b[current.key]) * (current.direction === 'asc' ? 1 : -1)) : rows
  const pad = dense ? 'px-3 h-8' : 'px-4 h-10'

  return (
    <div data-slot="data-table" className={cn('w-full overflow-x-auto rounded-xl border border-border bg-card text-card-foreground', className)}>
      <table className="w-full border-collapse text-sm">
        {caption ? <caption className="h-10 px-4 text-left text-sm font-medium">{caption}</caption> : null}
        <thead>
          <tr className="border-y border-border bg-muted/50">
            {columns.map((col) => {
              const dir = current?.key === col.key ? current.direction : null
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={col.sortable ? (dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none') : undefined}
                  className={cn(pad, 'font-medium whitespace-nowrap text-muted-foreground', ALIGN[col.align ?? 'left'])}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => change(col.key)}
                      className={cn('inline-flex cursor-pointer items-center gap-1 rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring', col.align === 'right' && 'flex-row-reverse')}
                    >
                      {col.header}
                      <svg aria-hidden viewBox="0 0 10 14" className="h-3.5 w-2.5" fill="currentColor">
                        <path d="M5 1 9 5H1z" opacity={dir === 'asc' ? 1 : 0.25} />
                        <path d="M5 13 1 9h8z" opacity={dir === 'desc' ? 1 : 0.25} />
                      </svg>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={cn(pad, 'text-center text-muted-foreground')}>
                {empty}
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr key={getRowId ? getRowId(row, i) : i} className="border-b border-border last:border-b-0 hover:bg-muted/40">
                {columns.map((col) => (
                  <td key={col.key} className={cn(pad, 'whitespace-nowrap tabular-nums', ALIGN[col.align ?? 'left'])}>
                    {col.render ? col.render(row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
