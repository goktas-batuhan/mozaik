import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { AnimatedToastStack, useAnimatedToastStack, type AnimatedToast } from './animated-toast-stack'

const toasts: AnimatedToast[] = [
  { id: 'a', title: 'Saved', status: 'success' },
  { id: 'b', title: 'Syncing', description: 'Hang tight', status: 'loading', action: { label: 'Cancel', onClick: () => {} } },
  { id: 'c', title: 'Offline', status: 'error' },
]

describe('AnimatedToastStack', () => {
  it('renders every toast in a polite live list', () => {
    render(<AnimatedToastStack toasts={toasts} />)
    const list = screen.getByRole('list')
    expect(list).toHaveAttribute('aria-live', 'polite')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('Hang tight')).toBeInTheDocument()
  })

  it('shows only the newest toasts up to maxVisible', () => {
    render(<AnimatedToastStack toasts={toasts} maxVisible={2} />)
    expect(screen.queryByText('Saved')).toBeNull()
    expect(screen.getByText('Syncing')).toBeInTheDocument()
    expect(screen.getByText('Offline')).toBeInTheDocument()
  })

  it('calls onDismiss with the toast id from the close button', () => {
    const onDismiss = vi.fn()
    render(<AnimatedToastStack toasts={[toasts[0]]} onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(onDismiss).toHaveBeenCalledWith('a')
  })

  it('hides the close button when a toast is not dismissible', () => {
    render(<AnimatedToastStack toasts={[{ ...toasts[0], dismissible: false }]} onDismiss={() => {}} />)
    expect(screen.queryByRole('button', { name: 'Dismiss notification' })).toBeNull()
  })

  it('runs a toast action with the toast', () => {
    const onClick = vi.fn()
    render(<AnimatedToastStack toasts={[{ id: 'x', title: 'Sent', action: { label: 'Undo', onClick } }]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'x' }))
  })

  it('renders into document.body when fixed (portal)', () => {
    const { container } = render(<AnimatedToastStack toasts={[toasts[0]]} fixed />)
    expect(container.querySelector('ol')).toBeNull()
    expect(document.body.querySelector('ol')).toBeInTheDocument()
  })
})

describe('useAnimatedToastStack', () => {
  afterEach(() => vi.useRealTimers())

  it('adds a toast and dismisses it after its duration', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useAnimatedToastStack())
    act(() => {
      result.current.showToast({ title: 'Hello', duration: 1000 })
    })
    expect(result.current.toasts).toHaveLength(1)
    act(() => {
      vi.advanceTimersByTime(1100)
    })
    expect(result.current.toasts).toHaveLength(0)
  })

  it('keeps a toast with duration 0 until it is dismissed', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useAnimatedToastStack())
    let id = ''
    act(() => {
      id = result.current.showToast({ title: 'Sticky', duration: 0 })
    })
    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(result.current.toasts).toHaveLength(1)
    act(() => result.current.dismissToast(id))
    expect(result.current.toasts).toHaveLength(0)
  })
})
