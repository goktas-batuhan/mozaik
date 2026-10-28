import { fireEvent, render, screen } from '@testing-library/react'
import { HeroGiantType } from './hero-giant-type'

describe('HeroGiantType', () => {
  it('puts every word in a single h1 in order', () => {
    render(<HeroGiantType words={['Digital', 'Success']} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('DigitalSuccess')
  })

  it('lists the services', () => {
    render(<HeroGiantType words={['A']} services={['Brand', 'Web']} />)
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Brand', 'Web'])
  })

  it('renders a button and fires onAction when there is no href', () => {
    const onAction = vi.fn()
    render(<HeroGiantType words={['A']} actionLabel="Book" onAction={onAction} />)
    fireEvent.click(screen.getByRole('button', { name: 'Book' }))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('renders a link when it has an href and shows the label and description', () => {
    render(<HeroGiantType words={['A']} label="Studio" description="Copy" actionLabel="Book" actionHref="/book" />)
    expect(screen.getByRole('link', { name: 'Book' })).toHaveAttribute('href', '/book')
    expect(screen.getByText('Studio')).toBeInTheDocument()
    expect(screen.getByText('Copy')).toBeInTheDocument()
  })
})
