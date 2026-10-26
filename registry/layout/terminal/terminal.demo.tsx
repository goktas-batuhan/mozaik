import { Terminal, TerminalLine, TerminalTyping } from './terminal'

export default function TerminalDemo() {
  return (
    <Terminal title="~/mozaik-site" className="h-80" startOnView={false}>
      <TerminalTyping>$ npm install motion</TerminalTyping>
      <TerminalLine className="text-muted-foreground">added 1 package in 1.1s</TerminalLine>
      <TerminalLine className="text-success">✔ Pasted terminal.tsx into src/components</TerminalLine>
      <TerminalLine className="text-success">✔ Found @/lib/utils</TerminalLine>
      <TerminalLine className="text-success">✔ Types check out</TerminalLine>
      <TerminalLine delay={0.3} className="text-muted-foreground">
        Done in 1.2s. Import it and ship.
      </TerminalLine>
      <TerminalTyping delay={0.4}>$ npm run dev</TerminalTyping>
    </Terminal>
  )
}
