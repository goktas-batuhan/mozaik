import { StatsSparklineCards } from './stats-sparkline-cards'

export default function StatsSparklineCardsDemo() {
  return (
    <div className="w-full max-w-5xl">
      <StatsSparklineCards
        title="Growth you can see"
        description="Every number comes with the shape of the last quarter."
        stats={[
          { label: 'Signups', value: 12.4, suffix: 'K', decimalPlaces: 1, history: [4, 5, 5, 7, 6, 8, 9, 9, 11, 12], caption: 'Last 10 weeks' },
          { label: 'Active teams', value: 3280, history: [20, 22, 21, 26, 30, 29, 35, 38, 41, 44], caption: 'Last 10 weeks' },
          { label: 'Revenue', value: 86, prefix: '$', suffix: 'K', history: [30, 28, 34, 40, 38, 52, 55, 61, 70, 86], caption: 'Last 10 months' },
          { label: 'Response time', value: 182, suffix: ' ms', history: [320, 300, 290, 260, 270, 230, 210, 200, 190, 182], caption: 'Lower is better' },
        ]}
      />
    </div>
  )
}
