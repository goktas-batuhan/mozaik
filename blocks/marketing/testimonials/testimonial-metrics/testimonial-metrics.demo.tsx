import { TestimonialMetrics } from './testimonial-metrics'

const items = [
  { id: 'm1', metric: '3x', metricLabel: 'faster releases', name: 'Liam Carter', role: 'CTO', company: 'Ashgrove', quote: 'Shipping used to be an event. Now it is a Tuesday.' },
  { id: 'm2', metric: '-40%', metricLabel: 'support tickets', name: 'Priya Raman', role: 'Founder', company: 'Quillbox', quote: 'Customers find answers on their own and the inbox finally has room to breathe.' },
  { id: 'm3', metric: '12 hrs', metricLabel: 'saved every week', name: 'Ravi Menon', role: 'Head of ops', company: 'Cobalt Row', quote: 'Reports that took an afternoon now arrive before the first coffee.' },
]

export default function TestimonialMetricsDemo() {
  return (
    <div className="w-full max-w-6xl">
      <TestimonialMetrics description="Three teams, three numbers." items={items} />
    </div>
  )
}
