import { render, screen } from '@testing-library/react'
import { Announcement, AnnouncementTag, AnnouncementTitle } from './announcement'

describe('Announcement', () => {
  it('renders the tag and the title', () => {
    render(
      <Announcement>
        <AnnouncementTag>New</AnnouncementTag>
        <AnnouncementTitle>Whale alerts are live</AnnouncementTitle>
      </Announcement>,
    )
    expect(screen.getByText('New')).toBeInTheDocument()
    expect(screen.getByText('Whale alerts are live')).toBeInTheDocument()
  })

  it('becomes a link when rendered as an anchor', () => {
    render(
      <Announcement as="a" href="/changelog">
        <AnnouncementTitle>Read the changelog</AnnouncementTitle>
      </Announcement>,
    )
    expect(screen.getByRole('link', { name: 'Read the changelog' })).toHaveAttribute('href', '/changelog')
  })

  it('marks the themed state for its tag to read', () => {
    const { container, rerender } = render(<Announcement>Hi</Announcement>)
    expect(container.firstElementChild).toHaveAttribute('data-themed', 'false')
    rerender(<Announcement themed>Hi</Announcement>)
    expect(container.firstElementChild).toHaveAttribute('data-themed', 'true')
  })

  it('switches the border style with the variant and keeps custom classes', () => {
    const { container } = render(
      <Announcement variant="secondary" className="custom">
        Hi
      </Announcement>,
    )
    expect(container.firstElementChild).toHaveClass('border-transparent', 'custom')
  })
})
