import { HeroTerminalInstall } from './hero-terminal-install'

export default function HeroTerminalInstallDemo() {
  return (
    <div className="w-full max-w-5xl">
      <HeroTerminalInstall
        title="Copy a component. Own every line."
        description="Add what you need with one command. No package to upgrade, no black box, just files in your own repo."
        link={{ label: 'Read the docs', href: '#' }}
      />
    </div>
  )
}
