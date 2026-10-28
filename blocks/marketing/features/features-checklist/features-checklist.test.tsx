import { fireEvent, render, screen } from '@testing-library/react'
import { FeaturesChecklist } from './features-checklist'

const items = [{ title: 'Domains', description: 'Custom.' }, { title: 'SSO' }, { title: 'Logs' }]

describe('FeaturesChecklist', () => {
  it('labels the section with its headline', () => {
    render(<FeaturesChecklist title="Included" items={items} />)
    expect(screen.getByRole('region', { name: 'Included' })).toBeInTheDocument()
  })

  it('lists every item and shows details only where given', () => {
    render(<FeaturesChecklist title="Included" items={items} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('Custom.')).toBeInTheDocument()
    expect(screen.getByText('SSO').parentElement?.querySelectorAll('p')).toHaveLength(1)
  })

  it('renders the action as a link when it has an href', () => {
    render(<FeaturesChecklist title="Included" items={items} action={{ label: 'Start', href: '/start' }} />)
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/start')
  })

  it('renders the action as a button otherwise and fires onClick', () => {
    const onClick = vi.fn()
    render(<FeaturesChecklist title="Included" items={items} action={{ label: 'Go', onClick }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('has no action when none is given', () => {
    render(<FeaturesChecklist title="Included" items={items} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
