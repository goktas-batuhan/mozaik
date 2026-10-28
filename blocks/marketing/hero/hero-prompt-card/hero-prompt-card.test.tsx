import { fireEvent, render, screen } from '@testing-library/react'
import { HeroPromptCard } from './hero-prompt-card'

describe('HeroPromptCard', () => {
  it('renders the headline and starts on the first option', () => {
    render(<HeroPromptCard title="Clear briefs" options={['Logo', 'App']} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Clear briefs' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Logo' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'App' })).toHaveAttribute('aria-checked', 'false')
  })

  it('moves the selection, calls onValueChange and rewrites the brief', () => {
    const onValueChange = vi.fn()
    render(<HeroPromptCard title="T" options={['Logo', 'App']} onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'App' }))
    expect(onValueChange).toHaveBeenCalledWith('App')
    expect(screen.getByRole('radio', { name: 'App' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText(/"App"/)).toBeInTheDocument()
  })

  it('respects defaultValue and a custom brief builder', () => {
    render(<HeroPromptCard title="T" options={['A', 'B']} defaultValue="B" brief={(v) => `Plan for ${v}`} />)
    expect(screen.getByText('Plan for B')).toBeInTheDocument()
  })

  it('renders the call to action as a link when it has an href', () => {
    render(<HeroPromptCard title="T" actionHref="/start" actionLabel="Start" />)
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/start')
  })
})
