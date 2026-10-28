import { NotificationBanner } from './notification-banner'

export default function NotificationBannerDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <NotificationBanner />
      <NotificationBanner message="Wallet copied to clipboard" actionLabel="" showTriggerLabel="Show copied notice" />
    </div>
  )
}
