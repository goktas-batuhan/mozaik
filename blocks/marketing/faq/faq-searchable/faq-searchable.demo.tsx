import { FaqSearchable } from './faq-searchable'

const items = [
  { id: 'trial', question: 'Is there a free trial?', answer: 'Yes. Every plan starts with 14 days free and needs no card.' },
  { id: 'cancel', question: 'Can I cancel at any time?', answer: 'Cancel from your account page whenever you like. You keep access until the period ends.' },
  { id: 'team', question: 'Can my team share one workspace?', answer: 'Invite as many teammates as your plan allows and give each a role.' },
  { id: 'export', question: 'How do I export my data?', answer: 'Open Settings, choose Export and we email you a ZIP with every file in open formats.' },
  { id: 'support', question: 'How fast does support reply?', answer: 'Most messages are answered within one working day.' },
]

export default function FaqSearchableDemo() {
  return (
    <div className="w-full max-w-4xl">
      <FaqSearchable description="Type a word and the list narrows to matching questions." items={items} />
    </div>
  )
}
