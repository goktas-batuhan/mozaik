import { FeaturesMetricsBeam } from './features-metrics-beam'

export default function FeaturesMetricsBeamDemo() {
  return (
    <div className="w-full max-w-5xl">
      <FeaturesMetricsBeam
        title="Numbers we are proud of"
        description="Reliability and speed are features too. Here is how we measure up."
        metrics={[
          { value: '99.99%', label: 'Uptime', description: 'Measured over the last twelve months across every region.' },
          { value: '42ms', label: 'Median response', description: 'From the nearest edge location to your user.' },
          { value: '3x', label: 'Faster releases', description: 'Reported by teams after their first quarter.' },
        ]}
      />
    </div>
  )
}
