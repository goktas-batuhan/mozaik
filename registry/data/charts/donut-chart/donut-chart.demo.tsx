import { DonutChart } from './donut-chart'

const TRAFFIC = [
  { label: 'Search', value: 540 },
  { label: 'Direct', value: 310 },
  { label: 'Social', value: 190 },
  { label: 'Email', value: 120 },
]

export default function DonutChartDemo() {
  return (
    <div className="w-[min(92vw,420px)]">
      <DonutChart data={TRAFFIC} label="Traffic sources" center={<span>1,160</span>} />
    </div>
  )
}
