import { useState } from 'react'
import { FileUpload } from './file-upload'

export default function FileUploadDemo() {
  const [uploaded, setUploaded] = useState<string[]>([])
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      {/* No onUpload: the component simulates every upload locally, nothing is sent anywhere. */}
      <FileUpload
        acceptedFileTypes={['image/*', '.pdf']}
        maxFileSize={10 * 1024 * 1024}
        maxFiles={4}
        uploadDelay={1800}
        simulateFailure
        onComplete={(files) => setUploaded(files.map((f) => f.name))}
      />
      <p className="text-center text-xs text-muted-foreground">
        {uploaded.length ? (
          <>
            Finished: <span className="text-foreground">{uploaded.join(', ')}</span>
          </>
        ) : (
          'Pick an image or PDF. The first attempt of every third file fails so you can try Retry.'
        )}
      </p>
    </div>
  )
}
