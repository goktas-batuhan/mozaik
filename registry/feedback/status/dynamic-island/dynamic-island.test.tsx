import { render, screen } from '@testing-library/react'
import { DynamicIsland, DynamicIslandView } from './dynamic-island'

let reduced = false
vi.mock('motion/react', async (orig) => ({
  ...(await orig<typeof import('motion/react')>()),
  useReducedMotion: () => reduced,
}))

const island = (view: string | null) => (
  <DynamicIsland view={view} compact={<span>Idle</span>}>
    <DynamicIslandView id="call">Calling Ada</DynamicIslandView>
    <DynamicIslandView id="timer">04:32</DynamicIslandView>
  </DynamicIsland>
)

describe('DynamicIsland', () => {
  beforeEach(() => {
    reduced = false
  })

  it('renders the compact pill when no view is active', () => {
    render(island(null))
    expect(screen.getByText('Idle')).toBeInTheDocument()
    expect(screen.queryByText('Calling Ada')).not.toBeInTheDocument()
  })

  it('exposes a polite live region and shows only the active view', () => {
    const { rerender } = render(island('call'))
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveTextContent('Calling Ada')
    expect(status).not.toHaveTextContent('04:32')
    rerender(island('timer'))
    expect(screen.getByRole('status')).toHaveTextContent('04:32')
  })

  it('throws when a view is used outside an island', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<DynamicIslandView id="x">x</DynamicIslandView>)).toThrow(/inside <DynamicIsland>/)
    spy.mockRestore()
  })

  it('swaps views without motion under reduced motion', () => {
    reduced = true
    const { rerender } = render(island('call'))
    rerender(island(null))
    expect(screen.getByText('Idle')).toBeInTheDocument()
    expect(screen.getByRole('status').getAttribute('style') ?? '').not.toMatch(/blur|scale/)
  })
})
