import { Terminal, TerminalLine, TerminalTyping } from './terminal'

export default function TerminalDemo() {
  return (
    <Terminal title="~/mozaik-site" className="h-80" startOnView={false}>
      <TerminalTyping>$ npx shadcn add @mozaik/terminal</TerminalTyping>
      <TerminalLine className="text-muted-foreground">Checking registry...</TerminalLine>
      <TerminalLine className="text-success">✔ Registry found</TerminalLine>
      <TerminalLine className="text-success">✔ Installed terminal.tsx</TerminalLine>
      <TerminalLine className="text-success">✔ Installed @/lib/utils</TerminalLine>
      <TerminalLine delay={0.3} className="text-muted-foreground">
        Done in 1.2s. Import it and ship.
      </TerminalLine>
      <TerminalTyping delay={0.4}>$ npm run dev</TerminalTyping>
    </Terminal>
  )
}
