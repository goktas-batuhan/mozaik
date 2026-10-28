import { FaqJourney } from './faq-journey'

const items = [
  { id: 'start', question: 'How do I get started?', answer: 'Create a workspace, name it and invite your team. It takes about two minutes.' },
  { id: 'import', question: 'Can I bring my existing files?', answer: 'Drag a folder into the workspace or connect a drive. Nothing is moved until you confirm.' },
  { id: 'share', question: 'How do I share my work?', answer: 'Every page has a share link. You choose who can view and who can edit.' },
  { id: 'review', question: 'How does review work?', answer: 'Reviewers leave comments in place. You resolve them and publish when ready.' },
  { id: 'ship', question: 'What happens when I publish?', answer: 'Your page goes live on its own address and the previous version stays in history.' },
]

export default function FaqJourneyDemo() {
  return (
    <div className="w-full max-w-4xl">
      <FaqJourney description="Five questions that follow the path from sign-up to launch." items={items} defaultOpen="start" />
    </div>
  )
}
