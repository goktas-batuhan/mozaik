import { fireEvent, render, screen } from '@testing-library/react'
import { SmoothAccordion } from './smooth-accordion'

const items = [
  { id: 'a', title: 'First', content: 'Alpha body' },
  { id: 'b', title: 'Second', content: 'Beta body' },
]

describe('SmoothAccordion', () => {
  it('shows the default open item with aria-expanded', () => {
    render(<SmoothAccordion items={items} defaultValue={['a']} />)
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Alpha body')).toBeInTheDocument()
    expect(screen.queryByText('Beta body')).not.toBeInTheDocument()
  })

  it('keeps one item open in single mode', () => {
    render(<SmoothAccordion items={items} defaultValue={['a']} />)
    fireEvent.click(screen.getByRole('button', { name: 'Second' }))
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('lets several items stay open in multiple mode', () => {
    const onValueChange = vi.fn()
    render(<SmoothAccordion items={items} type="multiple" onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'First' }))
    fireEvent.click(screen.getByRole('button', { name: 'Second' }))
    expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b'])
  })

  it('does not toggle when disabled', () => {
    render(<SmoothAccordion items={items} disabled />)
    expect(screen.getByRole('button', { name: 'First' })).toBeDisabled()
  })
})
