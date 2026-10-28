import { BarChart } from './bar-chart'

const WEEK = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 58 },
  { label: 'Wed', value: 51 },
  { label: 'Thu', value: 73 },
  { label: 'Fri', value: 66 },
  { label: 'Sat', value: 31 },
  { label: 'Sun', value: 24 },
]

export default function BarChartDemo() {
  return (
    <div className="w-[min(92vw,420px)]">
      <BarChart data={WEEK} label="Deploys this week" showValues />
    </div>
  )
}
