import { render, screen } from '@testing-library/react'
import { Terminal, TerminalLine, TerminalTyping } from './terminal'

describe('Terminal', () => {
  it('shows the title and gives screen readers the typed text up front', () => {
    render(
      <Terminal title="~/app" startOnView={false}>
        <TerminalTyping>$ npm install</TerminalTyping>
      </Terminal>,
    )
    expect(screen.getByText('~/app')).toBeInTheDocument()
    expect(screen.getByText('$ npm install', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('shows every line in full when disabled', () => {
    render(
      <Terminal disabled>
        <TerminalTyping>$ ls</TerminalTyping>
        <TerminalLine>done</TerminalLine>
      </Terminal>,
    )
    expect(screen.getByText('done')).toBeInTheDocument()
    expect(screen.getAllByText('$ ls')).toHaveLength(1 + 1)
  })

  it('hides the window dots from assistive tech', () => {
    const { container } = render(
      <Terminal>
        <TerminalLine>x</TerminalLine>
      </Terminal>,
    )
    expect(container.querySelectorAll('span[aria-hidden="true"]').length).toBeGreaterThanOrEqual(3)
  })
})
