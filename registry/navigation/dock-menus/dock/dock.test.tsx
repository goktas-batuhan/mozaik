import { render, screen } from '@testing-library/react'
import { Dock, DockIcon } from './dock'

describe('Dock', () => {
  it('renders a labelled group with its icons', () => {
    render(
      <Dock aria-label="Apps">
        <DockIcon>
          <button type="button" aria-label="One" />
        </DockIcon>
        <DockIcon>
          <button type="button" aria-label="Two" />
        </DockIcon>
      </Dock>,
    )
    expect(screen.getByRole('group', { name: 'Apps' })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('sizes the dock from iconSize', () => {
    render(
      <Dock iconSize={50} aria-label="Apps">
        <DockIcon />
      </Dock>,
    )
    expect(screen.getByRole('group')).toHaveStyle({ height: '68px' })
  })

  it('refuses to render an icon outside a dock', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<DockIcon />)).toThrow(/inside Dock/)
    spy.mockRestore()
  })
})
