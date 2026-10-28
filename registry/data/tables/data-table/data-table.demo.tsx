import { DataTable, type DataTableColumn } from './data-table'

interface Row extends Record<string, unknown> {
  id: string
  name: string
  region: string
  requests: number
  errors: number
}

const ROWS: Row[] = [
  { id: 'api', name: 'api-gateway', region: 'eu-west', requests: 128400, errors: 31 },
  { id: 'auth', name: 'auth', region: 'us-east', requests: 54210, errors: 4 },
  { id: 'search', name: 'search', region: 'eu-west', requests: 98770, errors: 112 },
  { id: 'billing', name: 'billing', region: 'ap-south', requests: 8120, errors: 0 },
]

const COLUMNS: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Service', sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
  { key: 'region', header: 'Region', sortable: true },
  { key: 'requests', header: 'Requests', align: 'right', sortable: true, render: (r) => r.requests.toLocaleString('en-US') },
  { key: 'errors', header: 'Errors', align: 'right', sortable: true },
]

export default function DataTableDemo() {
  return (
    <div className="w-[min(92vw,560px)]">
      <DataTable columns={COLUMNS} rows={ROWS} getRowId={(r) => r.id} caption="Services" defaultSort={{ key: 'requests', direction: 'desc' }} />
    </div>
  )
}
