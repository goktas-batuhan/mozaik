import { OrbitLoader } from './orbit-loader'

export default function OrbitLoaderDemo() {
  return (
    <div className="flex items-center gap-10">
      <OrbitLoader size={28} dots={2} label="Saving" />
      <OrbitLoader size={56} />
      <OrbitLoader size={96} dots={4} duration={3} className="text-muted-foreground" label="Syncing" />
    </div>
  )
}
