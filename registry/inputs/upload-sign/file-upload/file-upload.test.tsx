import { act, fireEvent, render, screen } from '@testing-library/react'
import { FileUpload } from './file-upload'

const png = (name = 'photo.png', size = 2048) => new File([new Uint8Array(size)], name, { type: 'image/png' })

function pick(container: HTMLElement, ...files: File[]) {
  const input = container.querySelector('input[type="file"]') as HTMLInputElement
  fireEvent.change(input, { target: { files } })
}

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => 'blob:preview')
  URL.revokeObjectURL = vi.fn()
})

describe('FileUpload', () => {
  it('shows the accepted types and limits in the drop zone', () => {
    render(<FileUpload acceptedFileTypes={['image/*', '.pdf']} maxFileSize={1024 * 1024} maxFiles={3} />)
    expect(screen.getByRole('button', { name: /Drop files here/ })).toHaveAccessibleDescription(
      'Images or PDF up to 1 MB · 3 max',
    )
  })

  it('uploads a picked file with a local simulation and reports completion', async () => {
    const onUploadSuccess = vi.fn()
    const onComplete = vi.fn()
    const { container } = render(<FileUpload uploadDelay={0} onUploadSuccess={onUploadSuccess} onComplete={onComplete} />)
    const file = png()
    pick(container, file)
    expect(await screen.findByText('photo.png')).toBeInTheDocument()
    await act(async () => {})
    expect(onUploadSuccess).toHaveBeenCalledWith(file)
    expect(onComplete).toHaveBeenCalledWith([file])
    expect(screen.getByText(/of 1 uploaded/)).toHaveTextContent('1 of 1 uploaded')
  })

  it('rejects files of the wrong type and files that are too large', async () => {
    const onUploadError = vi.fn()
    const { container } = render(
      <FileUpload acceptedFileTypes={['image/*']} maxFileSize={1000} uploadDelay={0} onUploadError={onUploadError} />,
    )
    pick(container, new File(['x'], 'notes.txt', { type: 'text/plain' }), png('big.png', 5000))
    await screen.findByText('notes.txt')
    expect(onUploadError).toHaveBeenCalledWith(expect.objectContaining({ code: 'INVALID_FILE_TYPE' }), expect.any(File))
    expect(onUploadError).toHaveBeenCalledWith(expect.objectContaining({ code: 'FILE_TOO_LARGE' }), expect.any(File))
    expect(screen.getByText(/Not Images/)).toBeInTheDocument()
    expect(screen.getByText(/Larger than 1000 B/)).toBeInTheDocument()
  })

  it('shows a Retry button when onUpload rejects, and retries', async () => {
    const onUpload = vi.fn().mockRejectedValueOnce(new Error('Server said no')).mockResolvedValue(undefined)
    const { container } = render(<FileUpload onUpload={onUpload} />)
    pick(container, png())
    expect(await screen.findByText(/Server said no/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Retry photo.png' }))
    expect(await screen.findByText('Uploaded')).toBeInTheDocument()
    expect(onUpload).toHaveBeenCalledTimes(2)
  })

  it('cancels a pending upload and reports the removed file', async () => {
    const onFileRemove = vi.fn()
    let signal: AbortSignal | undefined
    const onUpload = vi.fn((_file: File, helpers: { signal: AbortSignal }) => {
      signal = helpers.signal
      return new Promise<void>(() => {})
    })
    const { container } = render(<FileUpload onUpload={onUpload} onFileRemove={onFileRemove} />)
    const file = png()
    pick(container, file)
    fireEvent.click(await screen.findByRole('button', { name: 'Cancel photo.png' }))
    expect(signal?.aborted).toBe(true)
    expect(onFileRemove).toHaveBeenCalledWith(file)
  })

  it('stops at the file limit', async () => {
    const { container } = render(<FileUpload maxFiles={1} uploadDelay={0} />)
    pick(container, png('a.png'), png('b.png'))
    expect(await screen.findByRole('alert')).toHaveTextContent('1 file was not added. The limit is 1.')
    expect(screen.getByText('File limit reached')).toBeInTheDocument()
  })
})
