import { useState } from 'react'
import { OtpBoxedInput } from './otp-boxed-input'

export default function OtpBoxedInputDemo() {
  const [code, setCode] = useState('')
  const [verified, setVerified] = useState(false)
  const wrong = verified && code !== '123456'
  return (
    <OtpBoxedInput
      value={code}
      error={wrong}
      onChange={(next) => {
        setCode(next)
        setVerified(false)
      }}
      onComplete={() => setVerified(true)}
      destination="you@example.com"
      resendCooldown={30}
    />
  )
}
