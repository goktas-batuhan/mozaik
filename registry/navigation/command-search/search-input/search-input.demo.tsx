import { useState } from 'react'
import { SearchInput } from './search-input'

export default function SearchInputDemo() {
  const [value, setValue] = useState('')
  const tooShort = value.length > 0 && value.length < 3

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <SearchInput
        value={value}
        onChange={setValue}
        onClear={() => setValue('')}
        error={tooShort}
        errorMessage="Type at least 3 characters."
        hint="Search components, blocks and docs."
        placeholder="Search components…"
      />
      <SearchInput disabled defaultValue="Disabled field" />
    </div>
  )
}
