import { useState } from 'react'
import { CommandButton, type CommandButtonProps } from './command-button'

export default function CommandButtonDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="flex flex-col items-center gap-6">
      <CommandButton onClick={() => setCount((n) => n + 1)}>Search</CommandButton>
      <p className="text-sm text-muted-foreground">
        {count === 0 ? 'Press the shortcut anywhere on the page, or click.' : `Triggered ${count} time${count === 1 ? '' : 's'}.`}
      </p>
      <div className="flex items-center gap-4">
        <CommandButton shortcut="shift+n" global={false}>
          New note
        </CommandButton>
        <CommandButton shortcut="alt+enter" disabled>
          Disabled
        </CommandButton>
      </div>
    </div>
  )
}

export function VariantPreview(props: CommandButtonProps) {
  return <CommandButton {...props} />
}
