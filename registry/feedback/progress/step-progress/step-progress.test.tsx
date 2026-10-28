import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { StepProgress } from './step-progress'

const steps = ['Cart', 'Shipping', 'Payment']
const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)

describe('StepProgress', () => {
  it('reports the current step to assistive tech', () => {
    still(<StepProgress steps={steps} current={1} label="Checkout" />)
    const bar = screen.getByRole('progressbar', { name: 'Checkout' })
    expect(bar).toHaveAttribute('aria-valuenow', '1')
    expect(bar).toHaveAttribute('aria-valuemax', '3')
    expect(bar).toHaveAttribute('aria-valuetext', 'Step 2 of 3: Shipping')
  })

  it('marks done, current and upcoming segments', () => {
    const { container } = still(<StepProgress steps={steps} current={1} />)
    expect([...container.querySelectorAll('[data-segment]')].map((n) => n.getAttribute('data-segment'))).toEqual(['done', 'current', 'todo'])
    expect(screen.getByText('Shipping')).toHaveAttribute('aria-current', 'step')
  })

  it('says when everything is complete', () => {
    still(<StepProgress steps={steps} current={3} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'All 3 steps complete')
    expect(document.querySelector('[aria-current]')).toBeNull()
  })

  it('clamps out-of-range steps', () => {
    const { rerender } = still(<StepProgress steps={steps} current={-4} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    rerender(<MotionConfig reducedMotion="always"><StepProgress steps={steps} current={99} /></MotionConfig>)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3')
  })

  it('fills the current segment with partial', () => {
    const { container } = still(<StepProgress steps={steps} current={0} partial={0.25} />)
    const fill = container.querySelector('[data-segment="current"] > span') as HTMLElement
    expect(fill.style.transform).toContain('scaleX(0.25)')
  })
})
