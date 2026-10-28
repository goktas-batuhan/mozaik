import { useState } from 'react'
import { WalletCard, type WalletAccount, type WalletMember } from './wallet-card'

const ACCOUNTS: WalletAccount[] = [
  { id: 'main', label: 'Main wallet', balance: 12480.32, currency: 'USD', holder: 'Ada Lovelace', last4: '4821', expiry: '08/29', network: 'visa' },
  {
    id: 'vault',
    label: 'Cold vault',
    balance: 86250.9,
    currency: 'USD',
    holder: 'Ada Lovelace',
    last4: '9034',
    expiry: '11/30',
    network: 'mastercard',
    gradient: 'bg-gradient-to-br from-primary to-primary/60 text-primary-foreground',
  },
  { id: 'ops', label: 'Team ops', balance: 3120.5, currency: 'EUR', holder: 'Mozaik DAO', last4: '1177', expiry: '02/28', network: 'generic' },
]

const MEMBERS: WalletMember[] = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Linus Torvalds', 'Margaret Hamilton', 'Dennis Ritchie'].map(
  (name) => ({ id: name, name }),
)

export default function WalletCardDemo() {
  const [activeId, setActiveId] = useState('main')
  return (
    <div className="w-[min(92vw,380px)]">
      <WalletCard accounts={ACCOUNTS} members={MEMBERS} activeId={activeId} onActiveChange={setActiveId} />
    </div>
  )
}
