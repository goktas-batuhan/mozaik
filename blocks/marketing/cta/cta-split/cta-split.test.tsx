import { fireEvent, render, screen } from '@testing-library/react'
import { CtaSplit } from './cta-split'

describe('CtaSplit', () => {
  it('renders the headline as an h2 and the description', () => {
    render(<CtaSplit title="Ship faster" description="Drop it in" disabled />)
    expect(screen.getByRole('heading', { level: 2, name: 'Ship faster' })).toBeInTheDocument()
    expect(screen.getByText('Drop it in')).toBeInTheDocument()
  })

  it('renders your media instead of the built-in panel', () => {
    const { container } = render(<CtaSplit title="T" media={<img alt="Preview" />} disabled />)
    expect(screen.getByAltText('Preview')).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeNull()
  })

  it('draws a decorative panel hidden from assistive tech when no media is given', () => {
    const { container } = render(<CtaSplit title="T" disabled />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('moves the media to the left column on reverse', () => {
    render(<CtaSplit title="T" reverse disabled />)
    expect(screen.getByRole('heading', { level: 2 }).parentElement).toHaveClass('@3xl:order-2')
  })

  it('wires up both actions', () => {
    const onClick = vi.fn()
    render(<CtaSplit title="T" disabled primaryAction={{ label: 'Go', href: '/go' }} secondaryAction={{ label: 'Repo', onClick }} />)
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/go')
    fireEvent.click(screen.getByRole('button', { name: 'Repo' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
