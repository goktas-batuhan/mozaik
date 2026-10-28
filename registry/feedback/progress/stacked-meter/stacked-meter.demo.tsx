import { StackedMeter } from './stacked-meter'

const gb = (v: number) => `${v.toFixed(1)} GB`

export default function StackedMeterDemo() {
  return (
    <div className="w-[min(94vw,460px)] rounded-2xl border border-border bg-card p-5 text-card-foreground">
      <p className="mb-3 text-sm font-medium">Storage</p>
      <StackedMeter
        label="Storage"
        max={50}
        formatValue={gb}
        segments={[
          { label: 'Photos', value: 18.4 },
          { label: 'Videos', value: 11.2 },
          { label: 'Apps', value: 6.5 },
          { label: 'Other', value: 3.1 },
        ]}
      />
    </div>
  )
}
