import { TestimonialMarquee } from './testimonial-marquee'

const items = [
  { id: 't1', name: 'Mara Ellison', role: 'Design lead', company: 'Fernhill', quote: 'We replaced three internal tools in a week. The team stopped asking where things live.' },
  { id: 't2', name: 'Jonas Weber', role: 'Engineer', company: 'Tidewater', quote: 'Setup took ten minutes and the defaults were already close to what we would have built.' },
  { id: 't3', name: 'Priya Raman', role: 'Founder', company: 'Quillbox', quote: 'Our customers noticed the difference before we even announced the redesign.' },
  { id: 't4', name: 'Tomas Ortega', role: 'Product manager', company: 'Larkspur', quote: 'Review cycles got shorter because everyone finally works from the same page.' },
  { id: 't5', name: 'Hana Sato', role: 'Developer advocate', company: 'Brightwell', quote: 'Clear docs, sensible APIs and no surprises. Exactly what I want from a dependency.' },
  { id: 't6', name: 'Liam Carter', role: 'CTO', company: 'Ashgrove', quote: 'Onboarding new hires used to take a month. Now it takes a few days.' },
  { id: 't7', name: 'Sofia Lindqvist', role: 'Freelance designer', company: 'Studio Moss', quote: 'I hand clients a link and they actually leave useful feedback now.' },
  { id: 't8', name: 'Ravi Menon', role: 'Head of ops', company: 'Cobalt Row', quote: 'The reporting alone paid for the subscription in the first quarter.' },
  { id: 't9', name: 'Elena Petrova', role: 'Engineering manager', company: 'Hollowpine', quote: 'Fewer meetings, fewer handoffs and a roadmap people can read in a minute.' },
]

export default function TestimonialMarqueeDemo() {
  return (
    <div className="w-full max-w-6xl">
      <TestimonialMarquee description="A slow drift of kind words." items={items} />
    </div>
  )
}
