import { fireEvent, render, screen } from '@testing-library/react'
import { FooterStatus } from './footer-status'

const languages = [{ code: 'en', label: 'English' }, { code: 'de', label: 'Deutsch' }]

describe('FooterStatus', () => {
  it('links the status pill', () => {
    render(<FooterStatus brand="Acme" status="Degraded performance" statusHref="/status" />)
    expect(screen.getByRole('link', { name: 'Degraded performance' })).toHaveAttribute('href', '/status')
  })

  it('selects the first language by default and marks it pressed', () => {
    render(<FooterStatus brand="Acme" languages={languages} />)
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Deutsch' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('switches language and reports the code', () => {
    const onLanguageChange = vi.fn()
    render(<FooterStatus brand="Acme" languages={languages} onLanguageChange={onLanguageChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Deutsch' }))
    expect(onLanguageChange).toHaveBeenCalledWith('de')
    expect(screen.getByRole('button', { name: 'Deutsch' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('honours defaultLanguage', () => {
    render(<FooterStatus brand="Acme" languages={languages} defaultLanguage="de" />)
    expect(screen.getByRole('button', { name: 'Deutsch' })).toHaveAttribute('aria-pressed', 'true')
  })
})
