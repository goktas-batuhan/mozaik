import { useState } from 'react'
import { Pagination } from './pagination'

export default function PaginationDemo() {
  const [page, setPage] = useState(4)
  return (
    <div className="flex flex-col items-center gap-3">
      <Pagination page={page} totalPages={12} onPageChange={setPage} />
      <p className="text-sm text-muted-foreground">
        Page {page} of 12
      </p>
    </div>
  )
}
