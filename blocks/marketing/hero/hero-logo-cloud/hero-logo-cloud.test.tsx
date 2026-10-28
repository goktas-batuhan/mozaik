import { fireEvent, render, screen } from '@testing-library/react'
import { HeroLogoCloud } from './hero-logo-cloud'

describe('HeroLogoCloud', () => {
  it('renders both headline lines in one h1', () => {
    render(<HeroLogoCloud title={['Build AI', 'on solid ground']} />)
    const h = screen.getByRole('heading', { level: 1 })
    expect(h).toHaveTextContent('Build AI')
    expect(h).toHaveTextContent('on solid ground')
  })

  it('lists each logo name once', () => {
    render(<HeroLogoCloud title={['T']} logosLabel="Trusted by" logos={['Northwind', 'Lumen']} />)
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Northwind', 'Lumen'])
    expect(screen.getByText('Trusted by')).toBeInTheDocument()
  })

  it('draws custom logos through renderLogo', () => {
    render(<HeroLogoCloud title={['T']} logos={['A', 'B']} renderLogo={(n, i) => <b>{`${i}:${n}`}</b>} />)
    expect(screen.getByText('0:A')).toBeInTheDocument()
    expect(screen.getByText('1:B')).toBeInTheDocument()
  })

  it('wires up the actions as link and button', () => {
    const onClick = vi.fn()
    render(<HeroLogoCloud title={['T']} primaryAction={{ label: 'Go', href: '/go' }} secondaryAction={{ label: 'Sales', onClick }} />)
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/go')
    fireEvent.click(screen.getByRole('button', { name: 'Sales' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
