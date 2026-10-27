import { Suspense, lazy, type ComponentType } from 'react'

// Her öğe: registry/<group>/<shelf>/<ad>/ ya da blocks/<bölüm>/<raf>/<ad>/
const demoModules = import.meta.glob<{ default: ComponentType; VariantPreview?: ComponentType<Record<string, unknown>> }>(['/registry/*/*/*/*.demo.tsx', '/blocks/*/*/*/*.demo.tsx'])
const variantModules = import.meta.glob<{ variants: Variant[] }>(['/registry/*/*/*/variants.ts', '/blocks/*/*/*/variants.ts'], {
  eager: true,
})
const componentModules = import.meta.glob<Record<string, ComponentType<Record<string, unknown>>>>([
  '/registry/*/*/*/*.tsx',
  '/blocks/*/*/*/*.tsx',
  '!**/*.demo.tsx',
  '!**/*.test.tsx',
])

interface Variant {
  name: string
  title: string
  props: Record<string, unknown>
}

const nameOf = (path: string) => path.split('/')[4]
const exportName = (name: string) => name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())

const demos = Object.fromEntries(Object.entries(demoModules).map(([path, load]) => [nameOf(path), lazy(load)]))
const variants = Object.fromEntries(Object.entries(variantModules).map(([path, mod]) => [nameOf(path), mod.variants]))

/** Varyant önizlemesi: component'in kendisi, varyantın prop setiyle. İçeriği JSX olan component'te
 * demo dosyası `VariantPreview` verir; prop setini alır, içeriği (çocuklar, ikonlar) kendisi ekler. */
function variantPreview(name: string, variant: Variant) {
  const load = Object.entries(componentModules).find(([path]) => path.endsWith(`/${name}/${name}.tsx`))?.[1]
  const loadDemo = Object.entries(demoModules).find(([path]) => path.endsWith(`/${name}/${name}.demo.tsx`))?.[1]
  if (!load) return null
  return lazy(async () => {
    const Preview = (await loadDemo?.())?.VariantPreview ?? (await load())[exportName(name)]
    return { default: () => <Preview {...variant.props} /> }
  })
}

// ?c=<ad>[&v=<varyant>] tek demoyu tam ekranda açar (Playwright smoke bunu kullanır).
export function App() {
  const params = new URLSearchParams(location.search)
  const only = params.get('c')
  const v = params.get('v')
  const theme = params.get('theme')
  if (theme === 'light') document.documentElement.classList.remove('dark')

  if (only) {
    const variant = v ? variants[only]?.find((x) => x.name === v) : undefined
    const Demo = v ? variant && variantPreview(only, variant) : demos[only]
    if (!Demo) return <p>Unknown demo: {only}{v ? ` / ${v}` : ''}</p>
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
          {variants[name] && (
            <span className="ml-3 space-x-2 font-mono text-xs text-muted-foreground">
              {variants[name].map((x) => (
                <a key={x.name} href={`?c=${name}&v=${x.name}`} className="hover:text-foreground">
                  {x.name}
                </a>
              ))}
            </span>
          )}
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
