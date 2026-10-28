import { Home, Inbox, Settings, Users } from 'lucide-react'
import { useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './sidebar'

const links = [
  { id: 'home', label: 'Home', icon: <Home /> },
  { id: 'inbox', label: 'Inbox', icon: <Inbox /> },
  { id: 'team', label: 'Team', icon: <Users /> },
]

export default function SidebarDemo() {
  const [active, setActive] = useState('home')

  return (
    <SidebarProvider>
      <div className="flex h-80 w-full max-w-lg overflow-hidden rounded-xl border border-border">
        <Sidebar>
          <SidebarHeader>
            <SidebarTrigger />
            <SidebarLabel className="text-sm font-semibold">Mozaik</SidebarLabel>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.id}>
                  <SidebarMenuButton icon={link.icon} active={active === link.id} onClick={() => setActive(link.id)}>
                    {link.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenuButton icon={<Settings />}>Settings</SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>
        <main className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
          {links.find((l) => l.id === active)?.label} page
        </main>
      </div>
    </SidebarProvider>
  )
}
