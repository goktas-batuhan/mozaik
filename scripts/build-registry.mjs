// registry/<kategori>/<ad>/meta.json'lardan registry.json üretir, `shadcn build` koşar,
// sonra site için public/r/index.json yazar (meta + rozet + demo kaynağı).
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const registryDir = path.join(root, 'registry')
const gatePath = path.join(root, '.gate', 'status.json')
const gate = existsSync(gatePath) ? JSON.parse(readFileSync(gatePath, 'utf8')) : {}

const CATEGORY_ORDER = ['text', 'background', 'cursor', 'blocks', 'onchain', 'interactive', 'layout', 'feedback']

const metas = []
for (const cat of readdirSync(registryDir, { withFileTypes: true })) {
  if (!cat.isDirectory()) continue
  for (const dir of readdirSync(path.join(registryDir, cat.name), { withFileTypes: true })) {
    if (!dir.isDirectory()) continue
    const base = path.join(registryDir, cat.name, dir.name)
    const meta = JSON.parse(readFileSync(path.join(base, 'meta.json'), 'utf8'))
    if (meta.name !== dir.name) throw new Error(`${base}: meta.name "${meta.name}" klasör adıyla aynı olmalı`)
    if (meta.category !== cat.name) throw new Error(`${base}: meta.category "${meta.category}" klasörle aynı olmalı`)
    if (meta.layer === 'B' && !meta.source?.repo) throw new Error(`${base}: B katmanı source.repo ister`)
    meta.files ??= [`${meta.name}.tsx`]
    meta.status = gate[meta.name] ?? meta.status ?? 'beta'
    meta.demo = readFileSync(path.join(base, `${meta.name}.demo.tsx`), 'utf8')
    meta.dir = `registry/${cat.name}/${dir.name}`
    metas.push(meta)
  }
}

const catIndex = (c) => (CATEGORY_ORDER.includes(c) ? CATEGORY_ORDER.indexOf(c) : 99)
metas.sort((a, b) => catIndex(a.category) - catIndex(b.category) || (a.layer < b.layer ? -1 : a.layer > b.layer ? 1 : a.title.localeCompare(b.title)))

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'mozaik',
  homepage: 'https://github.com/goktas-batuhan/mozaik',
  items: metas.map((m) => ({
    name: m.name,
    type: 'registry:component',
    title: m.title,
    description: m.description,
    dependencies: m.dependencies ?? [],
    registryDependencies: ['utils', ...(m.registryDependencies ?? [])],
    files: m.files.map((f) => ({ path: `${m.dir}/${f}`, type: 'registry:component' })),
    ...(m.cssVars ? { cssVars: m.cssVars } : {}),
    ...(m.css ? { css: m.css } : {}),
    categories: [m.category],
    meta: { layer: m.layer, source: m.source, status: m.status },
  })),
}
writeFileSync(path.join(root, 'registry.json'), JSON.stringify(registry, null, 2) + '\n')

execSync('npx shadcn build', { cwd: root, stdio: 'inherit' })

// CREDITS.md tablosu meta.json'dan üretilir; elle düzenlenmez.
const creditsPath = path.join(root, 'CREDITS.md')
const credits = readFileSync(creditsPath, 'utf8')
const rows = metas
  .filter((m) => m.layer === 'B')
  .sort((a, b) => a.source.repo.localeCompare(b.source.repo) || a.name.localeCompare(b.name))
  .map((m) => `| ${m.name} | [${m.source.repo}](https://github.com/${m.source.repo}) | ${m.source.license} | [upstream](${m.source.url})${m.source.note ? ` ${m.source.note}` : ''} |`)
const table = ['| Component | Source repo | License | Notes |', '| --- | --- | --- | --- |', ...rows].join('\n')
writeFileSync(creditsPath, credits.replace(/\| Component \| Source repo[\s\S]*?(?=\n\n## )/, table))

const index = metas.map(({ dir, ...m }) => ({ ...m, path: dir }))
writeFileSync(path.join(root, 'public', 'r', 'index.json'), JSON.stringify(index, null, 2) + '\n')
console.log(`registry: ${metas.length} item, ${metas.filter((m) => m.status === 'stable').length} stable`)
