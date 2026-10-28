import { useState } from 'react'
import { ThemeSwitch, type ThemeSwitchProps, type ThemeSwitchTheme } from './theme-switch'

export default function ThemeSwitchDemo() {
  const [theme, setTheme] = useState<ThemeSwitchTheme>('light')
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <ThemeSwitch size="sm" />
        <ThemeSwitch theme={theme} onThemeChange={setTheme} showLabel />
        <ThemeSwitch size="lg" defaultTheme="dark" />
      </div>
      <p className="text-sm text-muted-foreground">The labelled switch is {theme}. It never changes the page theme itself.</p>
    </div>
  )
}

export function VariantPreview(props: ThemeSwitchProps) {
  return <ThemeSwitch {...props} />
}
