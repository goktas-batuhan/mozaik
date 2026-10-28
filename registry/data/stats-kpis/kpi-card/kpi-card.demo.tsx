import { KpiCard } from './kpi-card'

export default function KpiCardDemo() {
  return (
    <div className="grid w-[min(92vw,520px)] grid-cols-1 gap-3 sm:grid-cols-2">
      <KpiCard label="Revenue" prefix="$" value={48210} delta={12.4} deltaLabel="vs last month" trend={[12, 15, 14, 19, 22, 21, 27, 31]} />
      <KpiCard label="Error rate" value="0.42" suffix="%" delta={-18.2} lowerIsBetter deltaLabel="vs last week" trend={[9, 8, 11, 7, 6, 5, 4, 3]} />
      <KpiCard label="Active users" value={3912} delta={-3.1} deltaLabel="vs last week" />
      <KpiCard label="Median latency" value={182} suffix=" ms" delta={0} deltaLabel="no change" />
    </div>
  )
}
