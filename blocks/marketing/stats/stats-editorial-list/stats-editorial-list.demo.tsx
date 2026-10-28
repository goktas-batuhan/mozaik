import { StatsEditorialList } from './stats-editorial-list'

export default function StatsEditorialListDemo() {
  return (
    <div className="w-full max-w-4xl">
      <StatsEditorialList
        eyebrow="By the numbers"
        title="Eight years of small, steady progress"
        stats={[
          { value: 8, label: 'Years of steady work', description: 'Started with two founders, one shared desk and a very long to-do list.' },
          { value: 38, suffix: '%', label: 'Faster launches', description: 'Average time saved by teams after their first month on the platform.' },
          { value: 1.4, suffix: 'M', decimalPlaces: 1, label: 'Projects shipped', description: 'Created, deployed and still running today.' },
        ]}
      />
    </div>
  )
}
