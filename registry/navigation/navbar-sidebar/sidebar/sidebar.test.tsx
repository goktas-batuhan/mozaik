import { act, fireEvent, render, screen } from '@testing-library/react'
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from './sidebar'

function Rail({ defaultCollapsed = false, onCollapsedChange }: { defaultCollapsed?: boolean; onCollapsedChange?: (c: boolean) => void }) {
  return (
    <SidebarProvider defaultCollapsed={defaultCollapsed} onCollapsedChange={onCollapsedChange}>
      <Sidebar>
        <SidebarTrigger />
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton active icon={<svg data-testid="icon" />}>
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>Settings</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

describe('Sidebar', () => {
  it('renders a labelled aside with menu buttons and marks the active one', () => {
    render(<Rail />)
    expect(screen.getByRole('complementary', { name: 'Sidebar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Settings' })).not.toHaveAttribute('aria-current')
  })

  it('collapses and expands with the trigger and reports the change', () => {
    const onCollapsedChange = vi.fn()
    render(<Rail onCollapsedChange={onCollapsedChange} />)
    const trigger = screen.getByRole('button', { name: 'Collapse sidebar' })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(trigger)
    expect(onCollapsedChange).toHaveBeenLastCalledWith(true)
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('complementary')).toHaveAttribute('data-collapsed')
  })

  it('keeps labels readable as sr-only text once collapsed', () => {
    vi.useFakeTimers()
    render(<Rail defaultCollapsed />)
    // Collapsed buttons get their text as an accessible name.
    const dashboard = screen.getByRole('button', { name: 'Dashboard' })
    expect(dashboard).toHaveTextContent('Dashboard')
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(dashboard.querySelector('[data-slot="sidebar-label"]')).toHaveClass('sr-only')
    vi.useRealTimers()
  })

  it('shows the icon and calls the button onClick', () => {
    const onClick = vi.fn()
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarMenuButton icon={<svg data-testid="icon" />} onClick={onClick}>
            Inbox
          </SidebarMenuButton>
        </Sidebar>
      </SidebarProvider>,
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Inbox' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('throws when useSidebar is used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const Probe = () => {
      useSidebar()
      return null
    }
    expect(() => render(<Probe />)).toThrow(/SidebarProvider/)
    spy.mockRestore()
  })
})
