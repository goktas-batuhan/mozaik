import { act, fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { AddressChip, addressAvatar, isAddress, shortenAddress } from './address-chip'

const ADDRESS = '0x33cEb14560bd33b977Ada347Daa646D53418F12D'

describe('address helpers', () => {
  it('validates the 0x + 40 hex format', () => {
    expect(isAddress(ADDRESS)).toBe(true)
    expect(isAddress(ADDRESS.toLowerCase())).toBe(true)
    expect(isAddress('0x1234')).toBe(false)
    expect(isAddress('33cEb14560bd33b977Ada347Daa646D53418F12D')).toBe(false)
    expect(isAddress('0xZZcEb14560bd33b977Ada347Daa646D53418F12D')).toBe(false)
  })

  it('shortens deterministically and keeps short input', () => {
    expect(shortenAddress(ADDRESS)).toBe('0x33cE…F12D')
    expect(shortenAddress(ADDRESS, 6)).toBe('0x33cEb1…18F12D')
    expect(shortenAddress('0x1234')).toBe('0x1234')
    expect(shortenAddress(ADDRESS)).toBe(shortenAddress(ADDRESS))
  })

  it('derives the same avatar for the same address, ignoring case', () => {
    expect(addressAvatar(ADDRESS)).toEqual(addressAvatar(ADDRESS.toLowerCase()))
    expect(addressAvatar(ADDRESS)).not.toEqual(addressAvatar('0xBf38e418004a7f37b709a2ac6b392f0986470c30'))
  })
})

describe('AddressChip', () => {
  it('names the group with the full address and links to the explorer', () => {
    render(<AddressChip address={ADDRESS} label="mozaik.eth" href="https://example.com" />)
    expect(screen.getByRole('group', { name: `mozaik.eth, ${ADDRESS}` })).toBeInTheDocument()
    const link = screen.getByRole('link', { name: 'View mozaik.eth on explorer' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('copies the address and announces it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    render(<AddressChip address={ADDRESS} />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy address' }))
    })
    expect(writeText).toHaveBeenCalledWith(ADDRESS)
    expect(screen.getByRole('status')).toHaveTextContent('Copied')
    expect(screen.getByRole('button', { name: 'Address copied' })).toBeInTheDocument()
  })

  it('marks an invalid address and hides the copy button', () => {
    const { container } = render(<AddressChip address="0xnope" />)
    expect(screen.getByRole('group', { name: 'Invalid address: 0xnope' })).toBeInTheDocument()
    expect(container.firstElementChild).toHaveAttribute('data-valid', 'false')
    expect(screen.queryByRole('button')).toBeNull()
  })
})
