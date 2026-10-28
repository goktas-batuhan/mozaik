import { fireEvent, render, screen, within } from '@testing-library/react'
import { CollabToolbar } from './collab-toolbar'

describe('CollabToolbar', () => {
  it('renders a labelled toolbar with one button per icon', () => {
    render(<CollabToolbar groups={[['chat', 'inbox'], ['upload']]} />)
    expect(screen.getByRole('toolbar', { name: 'Collaboration toolbar' })).toBeInTheDocument()
    expect(screen.getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual(['Chat', 'Inbox', 'Upload'])
  })

  it('puts a divider between groups only', () => {
    const { container } = render(<CollabToolbar groups={[['chat'], ['inbox'], ['menu']]} />)
    expect(container.querySelectorAll('[data-slot="collab-toolbar-divider"]')).toHaveLength(2)
  })

  it('reports which icon was pressed', () => {
    const onIconClick = vi.fn()
    render(<CollabToolbar groups={[['chat', 'layers']]} onIconClick={onIconClick} />)
    fireEvent.click(screen.getByRole('button', { name: 'Layers' }))
    expect(onIconClick).toHaveBeenCalledWith('layers')
  })

  it('shows collaborators as named avatars with initials and no network request', () => {
    render(<CollabToolbar groups={[['chat'], 'avatars']} avatars={[{ name: 'Ada Lovelace' }, { name: 'Grace Hopper', imageUrl: 'https://example.com/g.png' }]} />)
    const group = screen.getByRole('group', { name: 'Collaborators' })
    const avatars = within(group).getAllByRole('img')
    expect(avatars.map((a) => a.getAttribute('aria-label'))).toEqual(['Ada Lovelace', 'Grace Hopper'])
    expect(avatars[0]).toHaveTextContent('AL')
    expect(avatars[1]).toHaveStyle({ backgroundImage: 'url(https://example.com/g.png)' })
  })
})
