import { render, screen } from '@testing-library/react'
import { Odometer } from './odometer'

const faces = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('[data-wheel]')).map((wheel) => {
    const strip = wheel.querySelector('.flex') as HTMLElement
    return strip.style.transform
  })

describe('Odometer', () => {
  it('exposes the formatted number once and hides the wheels', () => {
    const { container } = render(<Odometer value={12840} />)
    expect(screen.getByText('12,840', { selector: '.sr-only' })).toBeInTheDocument()
    expect(container.querySelectorAll('[data-wheel][aria-hidden="true"]')).toHaveLength(5)
  })

  it('puts one wheel on each digit and keeps separators as plain characters', () => {
    const { container } = render(<Odometer value={1234.5} format={{ minimumFractionDigits: 1 }} />)
    expect(container.querySelectorAll('[data-wheel]')).toHaveLength(5)
    expect(container.textContent).toContain(',')
    expect(container.textContent).toContain('.')
  })

  it('turns each wheel to its digit', () => {
    const { container } = render(<Odometer value={309} />)
    expect(faces(container)).toEqual(['translateY(-3em)', 'none', 'translateY(-9em)'])
  })

  it('rolls the same wheels to new faces when the value changes', () => {
    const { container, rerender } = render(<Odometer value={19} />)
    const before = Array.from(container.querySelectorAll('[data-wheel]'))
    rerender(<Odometer value={24} />)
    const after = Array.from(container.querySelectorAll('[data-wheel]'))
    expect(after).toEqual(before)
  })

  it('formats with the locale and options it is given', () => {
    render(<Odometer value={5} format={{ style: 'currency', currency: 'EUR' }} locale="en-US" />)
    expect(screen.getByText('€5.00', { selector: '.sr-only' })).toBeInTheDocument()
  })
})
