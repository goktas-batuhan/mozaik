import { PinnedList, type PinnedListItem } from './pinned-list'

const items: PinnedListItem[] = [
  { id: 'inbox', title: 'Inbox', meta: '12' },
  { id: 'drafts', title: 'Drafts', meta: '3' },
  { id: 'sent', title: 'Sent', meta: '248' },
  { id: 'archive', title: 'Archive', meta: '1.2k' },
  { id: 'trash', title: 'Trash', meta: '7' },
]

export default function PinnedListDemo() {
  return <PinnedList items={items} defaultPinned={['drafts']} maxPinned={3} className="w-[min(92vw,380px)]" aria-label="Mailboxes" />
}
