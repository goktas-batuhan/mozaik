import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { StackedMeter } from './stacked-meter'

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)
const segments = [
  { label: 'Photos', value: 20 },
  { label: 'Videos', value: 10 },
]

describe('StackedMeter', () => {
  it('summarises the parts and the used share in one image', () => {
    still(<StackedMeter segments={segments} max={60} label="Storage" />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Storage: Photos 20, Videos 10; 30 of 60 used')
  })

  it('sizes each segment against the capacity', () => {
    const { container } = still(<StackedMeter segments={segments} max={60} />)
    expect((container.querySelector('[data-segment="Photos"]') as HTMLElement).style.width).toContain('33.33')
    expect((container.querySelector('[data-segment="Videos"]') as HTMLElement).style.width).toContain('16.66')
  })

  it('fills the bar when there is no max and shows no free row', () => {
    const { container } = still(<StackedMeter segments={segments} />)
    expect((container.querySelector('[data-segment="Photos"]') as HTMLElement).style.width).toContain('66.66')
    expect(screen.queryByText('Free')).toBeNull()
  })

  it('shows the free space', () => {
    still(<StackedMeter segments={segments} max={50} />)
    expect(screen.getByText('Free').parentElement).toHaveTextContent('Free 20')
  })

  it('dims the other segments when a legend item is pinned', () => {
    const { container } = still(<StackedMeter segments={segments} max={60} />)
    const btn = screen.getByRole('button', { name: /Photos/ })
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('[data-segment="Videos"]')).toHaveAttribute('data-dimmed', 'true')
    expect(container.querySelector('[data-segment="Photos"]')).toHaveAttribute('data-dimmed', 'false')
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })
})
