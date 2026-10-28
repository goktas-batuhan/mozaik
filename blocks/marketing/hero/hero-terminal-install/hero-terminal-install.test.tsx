import { act, fireEvent, render, screen } from '@testing-library/react'
import { HeroTerminalInstall } from './hero-terminal-install'

describe('HeroTerminalInstall', () => {
  it('shows the command in the copy box', () => {
    render(<HeroTerminalInstall title="Own it" command="npx add thing" disabled />)
    expect(screen.getAllByText('npx add thing').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { level: 1, name: 'Own it' })).toBeInTheDocument()
  })

  it('copies the command, flips the label and calls onCopy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const onCopy = vi.fn()
    render(<HeroTerminalInstall title="T" command="npx add thing" onCopy={onCopy} disabled />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    })
    expect(writeText).toHaveBeenCalledWith('npx add thing')
    expect(onCopy).toHaveBeenCalledWith('npx add thing')
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })

  it('prints the output lines in the terminal when disabled', () => {
    render(<HeroTerminalInstall title="T" output={['Step one', 'Step two']} disabled />)
    expect(screen.getByText('Step one')).toBeInTheDocument()
    expect(screen.getByText('Step two')).toBeInTheDocument()
  })

  it('renders the docs link', () => {
    render(<HeroTerminalInstall title="T" link={{ label: 'Docs', href: '/docs' }} disabled />)
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs')
  })
})
