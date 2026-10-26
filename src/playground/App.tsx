import { Suspense, lazy, type ComponentType } from 'react'

// Her demo: registry/<kategori>/<ad>/<ad>.demo.tsx
const modules = import.meta.glob<{ default: ComponentType }>('/registry/*/*/*.demo.tsx')

const demos = Object.fromEntries(
  Object.entries(modules).map(([path, load]) => [path.split('/')[3], lazy(load)]),
)

// ?c=<ad> tek demoyu tam ekranda açar (Playwright smoke bunu kullanır).
export function App() {
  const params = new URLSearchParams(location.search)
  const only = params.get('c')
  const theme = params.get('theme')
  if (theme === 'light') document.documentElement.classList.remove('dark')

  if (only) {
    const Demo = demos[only]
    if (!Demo) return <p>Unknown demo: {only}</p>
    return (
      <main data-demo-root className="grid min-h-svh place-items-center p-8">
        <Suspense fallback={null}>
          <Demo />
        </Suspense>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl space-y-10 p-10">
      <h1 className="text-2xl font-semibold">Mozaik playground</h1>
      {Object.entries(demos).map(([name, Demo]) => (
        <section key={name} className="space-y-3">
          <a href={`?c=${name}`} className="font-mono text-sm text-muted-foreground hover:text-foreground">
            {name}
          </a>
          <div className="relative grid min-h-64 place-items-center overflow-hidden rounded-xl border p-8">
            <Suspense fallback={null}>
              <Demo />
            </Suspense>
          </div>
        </section>
      ))}
    </main>
  )
}
