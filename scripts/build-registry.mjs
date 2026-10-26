// registry/<group>/<shelf>/<ad>/ ve blocks/<bölüm>/<raf>/<ad>/ meta.json'larından registry.json üretir,
// `shadcn build` koşar, sonra site için public/r/index.json (meta + rozet + demo + varyantlar)
// ve public/r/taxonomy.json yazar.
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { listItems, loadVariants, root, taxonomy } from './items.mjs'

// Başka bir Mozaik öğesine bağımlılık tam URL olur; shadcn add onu da kurar.
const REGISTRY_BASE = 'https://raw.githubusercontent.com/goktas-batuhan/mozaik/main/public/r'

const gatePath = path.join(root, '.gate', 'status.json')
const gate = existsSync(gatePath) ? JSON.parse(readFileSync(gatePath, 'utf8')) : {}

const AXES = ['trigger', 'tech', 'theme'] // weight bağımlılıktan türetilir, elle yazılmaz
const allowed = new Set(AXES.flatMap((a) => taxonomy.tags[a]))
// "Newest" sıralaması için: dosyanın ilk eklendiği gün (taşımaları izler).
const added = (dir, name) =>
  execSync(`git log --follow --diff-filter=A --format=%as -- "${dir}/${name}.tsx"`, { cwd: root }).toString().trim().split('\n').pop() ||
  new Date().toISOString().slice(0, 10)

const items = listItems()
const names = new Set(items.map((i) => i.name))
const metas = []
for (const item of items) {
  const { name, dir, top, group, shelf, meta } = item
  const fail = (msg) => {
    throw new Error(`${dir}: ${msg}`)
  }
  const tree = top === 'blocks' ? taxonomy.blocks : taxonomy.groups
  const layer = top === 'blocks' ? 'block' : 'component'
  if (meta.name !== name) fail(`meta.name "${meta.name}" klasör adıyla aynı olmalı`)
  if (meta.group !== group || meta.shelf !== shelf) fail(`meta group/shelf "${meta.group}/${meta.shelf}" klasörle aynı olmalı`)
  if (!tree.find((g) => g.id === group)?.shelves.some((s) => s.id === shelf)) fail(`${group}/${shelf} taxonomy.json'da yok`)
  if (meta.layer !== layer) fail(`meta.layer "${meta.layer}" olmalı: ${layer}`)
  if (meta.source !== 'original' && !meta.source?.repo) fail('uyarlanan öğe source.repo ister')
  const bad = (meta.tags ?? []).filter((t) => !allowed.has(t))
  if (bad.length) fail(`bilinmeyen etiket: ${bad.join(', ')} (eksenler taxonomy.json'da)`)
  for (const dep of meta.registryDependencies ?? []) if (!names.has(dep)) fail(`registryDependencies: "${dep}" bir Mozaik öğesi değil`)

  const demo = readFileSync(path.join(root, dir, `${name}.demo.tsx`), 'utf8')
  const deps = meta.dependencies ?? []
  const weight = [
    ...(deps.length ? [] : ['zero-deps']),
    ...(deps.includes('motion') ? ['motion'] : []),
    ...(/from 'lucide-react'/.test(demo) ? ['lucide'] : []),
  ]
  const variants = (await loadVariants(item)).map((v) => {
    if (!/^[a-z0-9-]+$/.test(v.name)) fail(`varyant adı kebab-case olmalı: ${v.name}`)
    return { ...v, status: gate[`${name}/${v.name}`] ?? 'beta' }
  })
  metas.push({
    ...meta,
    tags: [...(meta.tags ?? []), ...weight],
    keywords: meta.keywords ?? [],
    files: meta.files ?? [`${name}.tsx`],
    status: gate[name] ?? 'beta',
    added: added(dir, name),
    variants,
    demo,
    dir,
  })
}

const order = (tree, g, s) => {
  const gi = tree.findIndex((x) => x.id === g)
  return gi * 100 + tree[gi].shelves.findIndex((x) => x.id === s)
}
const rank = (m) => (m.layer === 'block' ? 10_000 + order(taxonomy.blocks, m.group, m.shelf) : order(taxonomy.groups, m.group, m.shelf))
metas.sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title))

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'mozaik',
  homepage: 'https://github.com/goktas-batuhan/mozaik',
  items: metas.map((m) => ({
    name: m.name,
    type: m.layer === 'block' ? 'registry:block' : 'registry:component',
    title: m.title,
    description: m.description,
    dependencies: m.dependencies ?? [],
    registryDependencies: ['utils', ...(m.registryDependencies ?? []).map((d) => `${REGISTRY_BASE}/${d}.json`)],
    files: m.files.map((f) => ({ path: `${m.dir}/${f}`, type: 'registry:component' })),
    ...(m.cssVars ? { cssVars: m.cssVars } : {}),
    ...(m.css ? { css: m.css } : {}),
    categories: [m.group, m.shelf],
    meta: { group: m.group, shelf: m.shelf, layer: m.layer, source: m.source, status: m.status, variants: m.variants.length },
  })),
}
writeFileSync(path.join(root, 'registry.json'), JSON.stringify(registry, null, 2) + '\n')

execSync('npx shadcn build', { cwd: root, stdio: 'inherit' })

// CREDITS.md tablosu meta.json'dan üretilir; elle düzenlenmez.
const creditsPath = path.join(root, 'CREDITS.md')
const credits = readFileSync(creditsPath, 'utf8')
const rows = metas
  .filter((m) => m.source !== 'original')
  .sort((a, b) => a.source.repo.localeCompare(b.source.repo) || a.name.localeCompare(b.name))
  .map((m) => `| ${m.name} | [${m.source.repo}](https://github.com/${m.source.repo}) | ${m.source.license} | [upstream](${m.source.url})${m.source.note ? ` ${m.source.note}` : ''} |`)
const table = ['| Component | Source repo | License | Notes |', '| --- | --- | --- | --- |', ...rows].join('\n')
writeFileSync(creditsPath, credits.replace(/\| Component \| Source repo[\s\S]*?(?=\n\n## )/, table))

const index = metas.map(({ dir, ...m }) => ({ ...m, path: dir }))
writeFileSync(path.join(root, 'public', 'r', 'index.json'), JSON.stringify(index, null, 2) + '\n')
writeFileSync(path.join(root, 'public', 'r', 'taxonomy.json'), JSON.stringify(taxonomy, null, 2) + '\n')
const count = (l) => metas.filter((m) => m.layer === l).length
const variantCount = metas.reduce((n, m) => n + m.variants.length, 0)
console.log(
  `registry: ${count('component')} component · ${variantCount} variant · ${count('block')} block; ${metas.filter((m) => m.status === 'stable').length} stable`,
)
