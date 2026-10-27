import { FolderOpen, Home, Mail, Search, Settings, Terminal } from 'lucide-react'
import type { ReactNode } from 'react'
import { Dock, DockIcon, type DockProps } from './dock'

const items: { label: string; icon: ReactNode }[] = [
  { label: 'Home', icon: <Home /> },
  { label: 'Search', icon: <Search /> },
  { label: 'Files', icon: <FolderOpen /> },
  { label: 'Terminal', icon: <Terminal /> },
  { label: 'Mail', icon: <Mail /> },
  { label: 'Settings', icon: <Settings /> },
]

function Icons() {
  return (
    <>
      {items.map((item) => (
          <DockIcon key={item.label}>
            <button
              type="button"
              aria-label={item.label}
              className="grid size-full place-items-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&>svg]:size-1/2"
            >
              {item.icon}
            </button>
          </DockIcon>
        ))}
      </>
  )
}

export default function DockDemo() {
  return (
    <div className="flex h-56 w-[min(40rem,90vw)] flex-col items-center justify-end gap-6">
      <p className="text-sm text-muted-foreground">Move the pointer along the dock.</p>
      <Dock aria-label="Application dock">
        <Icons />
      </Dock>
    </div>
  )
}

export function VariantPreview(props: Omit<DockProps, 'children'>) {
  return (
    <div className="flex h-56 w-[min(40rem,90vw)] flex-col items-center justify-end gap-6">
      <p className="text-sm text-muted-foreground">Move the pointer along the dock.</p>
      <Dock aria-label="Application dock" {...props}>
        <Icons />
      </Dock>
    </div>
  )
}
