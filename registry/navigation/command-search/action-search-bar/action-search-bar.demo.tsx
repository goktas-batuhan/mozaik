import {
  Activity,
  BookOpen,
  Copy,
  FilePlus,
  FolderInput,
  History,
  Keyboard,
  Link2,
  SunMoon,
  UserPlus,
} from 'lucide-react'
import { useState } from 'react'
import { ActionSearchBar, type CommandItem } from './action-search-bar'

const icon = 'size-4'

const items: CommandItem[] = [
  { id: 'new-document', label: 'New document', icon: <FilePlus className={icon} />, group: 'Actions', keywords: ['create', 'page', 'file'], shortcut: ['⌘', 'N'] },
  { id: 'duplicate', label: 'Duplicate page', icon: <Copy className={icon} />, group: 'Actions', keywords: ['copy', 'clone'], shortcut: ['⌘', 'D'] },
  {
    id: 'move',
    label: 'Move to…',
    icon: <FolderInput className={icon} />,
    group: 'Actions',
    keywords: ['folder', 'file'],
    placeholder: 'Move to which folder?',
    children: [
      { id: 'move-inbox', label: 'Inbox', icon: <FolderInput className={icon} /> },
      { id: 'move-projects', label: 'Projects', icon: <FolderInput className={icon} /> },
      { id: 'move-archive', label: 'Archive', icon: <FolderInput className={icon} /> },
    ],
  },
  {
    id: 'theme',
    label: 'Change theme',
    icon: <SunMoon className={icon} />,
    group: 'Actions',
    keywords: ['appearance', 'dark', 'light', 'mode'],
    placeholder: 'Choose a theme…',
    children: [
      { id: 'theme-light', label: 'Light', icon: <SunMoon className={icon} /> },
      { id: 'theme-dark', label: 'Dark', icon: <SunMoon className={icon} /> },
      { id: 'theme-system', label: 'Match system', icon: <SunMoon className={icon} /> },
    ],
  },
  { id: 'invite', label: 'Invite member', icon: <UserPlus className={icon} />, group: 'Actions', keywords: ['team', 'share', 'add'] },
  { id: 'copy-link', label: 'Copy link', icon: <Link2 className={icon} />, group: 'Actions', keywords: ['url', 'share'], shortcut: ['⌘', 'L'] },
  { id: 'docs', label: 'Documentation', icon: <BookOpen className={icon} />, group: 'Links', keywords: ['help', 'guide'], href: '/docs' },
  { id: 'changelog', label: 'Changelog', icon: <History className={icon} />, group: 'Links', keywords: ['release', 'updates', 'new'], href: '/changelog' },
  { id: 'status', label: 'Status page', icon: <Activity className={icon} />, group: 'Links', keywords: ['uptime', 'incident'], href: '/status' },
  { id: 'shortcuts', label: 'Keyboard shortcuts', icon: <Keyboard className={icon} />, group: 'Links', keywords: ['keys', 'hotkeys'], href: '/shortcuts' },
]

export default function ActionSearchBarDemo() {
  const [last, setLast] = useState<string | null>(null)

  return (
    <div className="flex h-96 w-full max-w-md flex-col gap-3">
      <ActionSearchBar
        items={items}
        defaultRecent={['copy-link', 'theme-dark']}
        onSelect={(item) =>
          // A short promise shows the in-row spinner before the check mark.
          new Promise<void>((resolve) => {
            setTimeout(() => {
              setLast(item.label)
              resolve()
            }, 600)
          })
        }
      />
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {last ? `Ran: ${last}` : 'Click the bar, press Cmd/Ctrl + K while it is focused, or just type.'}
      </p>
    </div>
  )
}
