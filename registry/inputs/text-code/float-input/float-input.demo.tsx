import { useState } from 'react'
import { FloatInput } from './float-input'

export default function FloatInputDemo() {
  const [email, setEmail] = useState('')
  return (
    <div className="flex w-72 flex-col gap-8 pt-6">
      <FloatInput label="Email address" placeholder="you@example.com" value={email} onChange={setEmail} />
      <FloatInput label="Project name" defaultValue="Mozaik" />
      <FloatInput label="Disabled" disabled />
    </div>
  )
}
