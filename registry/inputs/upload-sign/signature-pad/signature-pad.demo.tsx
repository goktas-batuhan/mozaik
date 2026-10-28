import { useState } from 'react'
import { SignaturePad } from './signature-pad'

export default function SignaturePadDemo() {
  const [svg, setSvg] = useState<string | null>(null)
  return (
    <div className="flex w-full max-w-[380px] flex-col items-center gap-4">
      <SignaturePad onChange={setSvg} />
      <p className="text-center text-xs text-muted-foreground">
        {svg ? (
          <>
            Captured as SVG, <span className="text-foreground tabular-nums">{svg.length.toLocaleString('en-US')}</span> characters.
          </>
        ) : (
          'Sign above with mouse, touch or pen. Ctrl or Cmd+Z undoes, Backspace clears.'
        )}
      </p>
    </div>
  )
}
