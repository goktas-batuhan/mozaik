import { FaqCategorized } from './faq-categorized'

const categories = [
  {
    id: 'billing',
    label: 'Billing',
    items: [
      { id: 'trial', question: 'Is there a free trial?', answer: 'Yes. Every plan starts with 14 days free and needs no card.' },
      { id: 'invoice', question: 'Where do I find my invoices?', answer: 'Under Settings, Billing. Each one is a PDF you can download.' },
      { id: 'cancel', question: 'Can I cancel at any time?', answer: 'Yes. You keep access until the end of the paid period.' },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    items: [
      { id: 'team', question: 'Can my team share a workspace?', answer: 'Invite teammates by email and give each one a role.' },
      { id: 'password', question: 'How do I reset my password?', answer: 'Use the reset link on the sign-in page. It stays valid for one hour.' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    items: [
      { id: 'export', question: 'How do I export my data?', answer: 'Open Settings, choose Export and we email you a ZIP in open formats.' },
      { id: 'delete', question: 'Can you delete my data?', answer: 'Delete the workspace and every file is removed within 30 days.' },
    ],
  },
]

export default function FaqCategorizedDemo() {
  return (
    <div className="w-full max-w-4xl">
      <FaqCategorized description="Pick a topic to see its questions." categories={categories} />
    </div>
  )
}
