import { fireEvent, render, screen } from '@testing-library/react'
import { AIContextMeter, formatTokens } from './ai-context-meter'

describe('AIContextMeter', () => {
  it('describes the usage in its accessible name', () => {
    render(<AIContextMeter used={50000} limit={200000} />)
    expect(screen.getByRole('button', { name: 'Context window 25% used, 50k of 200k tokens' })).toBeInTheDocument()
  })

  it('changes level at the warning and danger thresholds', () => {
    const { rerender } = render(<AIContextMeter used={100} limit={1000} />)
    const level = () => screen.getByRole('button').getAttribute('data-level')
    expect(level()).toBe('ok')
    rerender(<AIContextMeter used={850} limit={1000} />)
    expect(level()).toBe('warning')
    rerender(<AIContextMeter used={990} limit={1000} />)
    expect(level()).toBe('danger')
  })

  it('shows the breakdown on focus and hides it on blur', () => {
    render(<AIContextMeter used={5000} limit={10000} breakdown={[{ label: 'Files', tokens: 3200 }]} />)
    const button = screen.getByRole('button')
    expect(screen.queryByRole('tooltip')).toBeNull()
    fireEvent.focus(button)
    expect(screen.getByRole('tooltip')).toHaveTextContent('Files')
    fireEvent.blur(button)
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('clamps overflow and formats counts', () => {
    render(<AIContextMeter used={999999} limit={1000} />)
    expect(screen.getByRole('button').getAttribute('aria-label')).toContain('100% used')
    expect(formatTokens(1800)).toBe('1.8k')
    expect(formatTokens(1_500_000)).toBe('1.5M')
  })
})
