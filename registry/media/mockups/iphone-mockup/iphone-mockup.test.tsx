import { render, screen } from '@testing-library/react'
import { IphoneMockup } from './iphone-mockup'

describe('IphoneMockup', () => {
  it('renders its children inside the screen', () => {
    render(<IphoneMockup><button>Open</button></IphoneMockup>)
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('keeps the frame out of the accessibility tree', () => {
    const { container } = render(<IphoneMockup>Hi</IphoneMockup>)
    const decor = container.querySelectorAll('[aria-hidden="true"]')
    expect(decor.length).toBeGreaterThanOrEqual(5)
    decor.forEach((n) => expect(n.textContent).toBe(''))
  })

  it('can hide the island and merges className', () => {
    const { container, rerender } = render(<IphoneMockup className="max-w-[100px]" />)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('max-w-[100px]')
    expect(root.style.aspectRatio).toContain('433')
    const withIsland = container.querySelectorAll('span[aria-hidden]').length
    rerender(<IphoneMockup island={false} />)
    expect(container.querySelectorAll('span[aria-hidden]').length).toBe(withIsland - 1)
  })
})
