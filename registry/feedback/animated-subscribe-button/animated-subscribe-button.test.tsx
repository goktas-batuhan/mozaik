import { fireEvent, render, screen } from '@testing-library/react'
import { AnimatedSubscribeButton } from './animated-subscribe-button'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

describe('AnimatedSubscribeButton', () => {
  beforeEach(() => {
    reduced = false
  })

  it('renders the idle label on a real button', () => {
    render(
      <AnimatedSubscribeButton>
        <span>Subscribe</span>
        <span>Subscribed</span>
      </AnimatedSubscribeButton>,
    )
    const button = screen.getByRole('button', { name: 'Subscribe' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('toggles on click and announces the result politely', async () => {
    reduced = true
    const onChange = vi.fn()
    render(
      <AnimatedSubscribeButton onSubscribedChange={onChange}>
        <span>Subscribe</span>
        <span>Subscribed</span>
      </AnimatedSubscribeButton>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onChange).toHaveBeenCalledWith(true)
    expect(await screen.findByRole('button', { name: 'Subscribed' })).toHaveAttribute('aria-pressed', 'true')
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveTextContent('Subscribed')
  })

  it('follows the controlled prop and ignores clicks when disabled', () => {
    reduced = true
    const onChange = vi.fn()
    const { rerender } = render(
      <AnimatedSubscribeButton subscribed={false} onSubscribedChange={onChange} disabled>
        <span>Follow</span>
        <span>Following</span>
      </AnimatedSubscribeButton>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onChange).not.toHaveBeenCalled()
    rerender(
      <AnimatedSubscribeButton subscribed onSubscribedChange={onChange}>
        <span>Follow</span>
        <span>Following</span>
      </AnimatedSubscribeButton>,
    )
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('swaps labels without sliding under reduced motion', () => {
    reduced = true
    render(
      <AnimatedSubscribeButton defaultSubscribed>
        <span>Subscribe</span>
        <span>Subscribed</span>
      </AnimatedSubscribeButton>,
    )
    const label = screen.getByRole('button').firstElementChild as HTMLElement
    expect(label.style.transform).toBe('none')
  })
})
