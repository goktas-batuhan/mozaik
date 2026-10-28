import { FeaturesTerminal } from './features-terminal'

export default function FeaturesTerminalDemo() {
  return (
    <div className="w-full max-w-5xl">
      <FeaturesTerminal
        title="Ships from your terminal"
        description="Everything you do in the dashboard, you can script."
        terminalTitle="~/my-app"
        features={[
          { title: 'One-command deploys', description: 'Push a build to production without leaving your shell.' },
          { title: 'Instant previews', description: 'Every branch gets a shareable URL in seconds.' },
          { title: 'Scriptable everything', description: 'A typed CLI and API for all of it.' },
        ]}
        lines={[
          { kind: 'command', text: 'mozaik deploy --prod' },
          { text: 'Building 128 modules...' },
          { text: 'Uploading assets (2.4 MB)' },
          { kind: 'success', text: '✔ Build finished in 4.1s' },
          { kind: 'success', text: '✔ Live at https://my-app.example.com' },
        ]}
      />
    </div>
  )
}
