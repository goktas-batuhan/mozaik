import { ArrowRight } from 'lucide-react'
import { Announcement, AnnouncementTag, AnnouncementTitle } from './announcement'

export default function AnnouncementDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Announcement as="a" href="#changelog">
        <AnnouncementTag>Latest update</AnnouncementTag>
        <AnnouncementTitle>
          New signal feeds are live
          <ArrowRight aria-hidden className="size-3 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </AnnouncementTitle>
      </Announcement>
      <Announcement themed variant="secondary">
        <AnnouncementTag>Beta</AnnouncementTag>
        <AnnouncementTitle>Wallet tracking</AnnouncementTitle>
      </Announcement>
    </div>
  )
}
