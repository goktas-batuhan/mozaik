import { fireEvent, render, screen } from '@testing-library/react'
import { BentoCard, BentoGrid } from './bento-grid'

describe('BentoGrid', () => {
  it('turns an href card into a link named by its title', () => {
    render(
      <BentoGrid>
        <BentoCard title="Docs" description="Read them" href="/docs" />
      </BentoGrid>,
    )
    expect(screen.getByRole('heading', { name: 'Docs' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs')
  })

  it('turns an onClick card into a keyboard-reachable button', () => {
    const onClick = vi.fn()
    render(
      <BentoGrid>
        <BentoCard title="Open" onClick={onClick} />
      </BentoGrid>,
    )
    const button = screen.getByRole('button', { name: 'Open' })
    button.focus()
    expect(button).toHaveFocus()
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('hides the visual and icon from assistive tech', () => {
    const { container } = render(
      <BentoGrid>
        <BentoCard title="Art" icon={<svg data-testid="icon" />} visual={<div data-testid="visual" />} />
      </BentoGrid>,
    )
    expect(screen.getByTestId('visual').closest('[aria-hidden]')).not.toBeNull()
    expect(screen.getByTestId('icon').closest('[aria-hidden]')).not.toBeNull()
    expect(container.querySelector('a, button')).toBeNull()
  })

  it('clamps the column span to the grid columns', () => {
    render(
      <BentoGrid columns={2}>
        <BentoCard title="Wide" colSpan={3} />
      </BentoGrid>,
    )
    const card = screen.getByRole('heading', { name: 'Wide' }).closest('.group\\/bento')!
    expect(card.className).toContain('@2xl:col-span-2')
    expect(card.className).not.toContain('col-span-3')
  })
})
