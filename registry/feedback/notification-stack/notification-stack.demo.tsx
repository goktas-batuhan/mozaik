import { NotificationStack, type StackNotification } from './notification-stack'

const badge = (initials: string) => (
  <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-xs font-semibold text-primary">
    {initials}
  </span>
)

const notifications: StackNotification[] = [
  { id: 'n-1', app: 'Messages', title: 'Maya Chen', body: 'Pushed the fix. Can you take a look before standup?', time: 'now', icon: badge('MC') },
  { id: 'n-2', app: 'Calendar', title: 'Design review in 10 min', body: 'Room 4B, registry roadmap', time: '9:50', icon: badge('CA') },
  { id: 'n-3', app: 'Mail', title: 'Invoice #2041 paid', body: 'Acme Inc. paid $1,280.00. The receipt is attached.', time: '9:12', icon: badge('ML') },
  { id: 'n-4', app: 'Wallet', title: 'Card payment', body: '$4.50 at Blue Bottle Coffee', time: '8:31', icon: badge('WA') },
]

export default function NotificationStackDemo() {
  return (
    <div className="min-h-80 w-[min(24rem,90vw)]">
      <NotificationStack notifications={notifications} />
    </div>
  )
}
