import { SlideTextButton } from './slide-text-button'

export default function SlideTextButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <SlideTextButton text="Browse components" hoverText="Open the gallery" />
        <SlideTextButton variant="ghost" text="Read the docs" hoverText="Start reading" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <SlideTextButton href="#install" text="npx shadcn add" hoverText="Copy command" variant="ghost" className="font-mono" />
        <SlideTextButton text="Unavailable" disabled />
      </div>
      <p className="text-sm text-muted-foreground">Hover or tab to a button to swap its label.</p>
    </div>
  )
}
