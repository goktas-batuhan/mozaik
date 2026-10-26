import { act, fireEvent, render, screen } from '@testing-library/react'
import { NotificationStack, type StackNotification } from './notification-stack'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

const items: StackNotification[] = [
  { id: 'a', app: 'Mail', title: 'Invoice paid', body: 'Receipt attached', time: 'now' },
  { id: 'b', app: 'Chat', title: 'New message', body: 'Take a look', time: '1m' },
  { id: 'c', app: 'Cal', title: 'Review soon', body: 'Room 4B', time: '2m' },
]

describe('NotificationStack', () => {
  beforeEach(() => {
    reduced = false
    vi.useRealTimers()
  })

  it('renders a labelled list of notifications with a count', () => {
    render(<NotificationStack notifications={items} />)
    expect(screen.getByRole('list', { name: 'Notifications' })).toBeInTheDocument()
    expect(screen.getAllByRole('article', { hidden: true })).toHaveLength(3)
    expect(screen.getByText('Invoice paid')).toBeInTheDocument()
  })

  it('announces a dismissal in a polite live region and calls onDismiss', () => {
    reduced = true
    const onDismiss = vi.fn()
    render(<NotificationStack notifications={items} onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss Invoice paid', hidden: true }))
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveTextContent('Invoice paid dismissed. 2 remaining.')
    expect(onDismiss).toHaveBeenCalledWith('a')
    expect(screen.queryByText('Invoice paid')).not.toBeInTheDocument()
  })

  it('dismisses with the Delete key', () => {
    reduced = true
    render(<NotificationStack notifications={items} />)
    fireEvent.keyDown(screen.getByRole('article', { name: /Mail: Invoice paid/, hidden: true }), { key: 'Delete' })
    expect(screen.queryByText('Invoice paid')).not.toBeInTheDocument()
  })

  it('animates the exit, then removes the card', () => {
    vi.useFakeTimers()
    render(<NotificationStack notifications={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss Invoice paid', hidden: true }))
    expect(screen.getByText('Invoice paid')).toBeInTheDocument()
    act(() => void vi.advanceTimersByTime(400))
    expect(screen.queryByText('Invoice paid')).not.toBeInTheDocument()
  })

  it('turns every transition off under reduced motion', () => {
    reduced = true
    const { container } = render(<NotificationStack notifications={items} />)
    expect(container.querySelector('ol')).toHaveStyle({ transition: 'none' })
    expect(container.querySelector('li')).toHaveStyle({ transition: 'none' })
  })
})
