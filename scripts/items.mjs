// Öğe listesi tek yerden: registry/<group>/<shelf>/<ad>/ (component) ve blocks/<bölüm>/<raf>/<ad>/ (blok).
// build-registry, gate, link-components ve smoke testi bunu okur.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

export const root = path.resolve(import.meta.dirname, '..')
export const taxonomy = JSON.parse(readFileSync(path.join(root, 'registry/taxonomy.json'), 'utf8'))

const dirs = (p) => (existsSync(p) ? readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : [])

/** Her öğe: { name, dir (repo köküne göre), meta }. Klasör sırası: top/group/shelf/name. */
export function listItems() {
  const items = []
  for (const top of ['registry', 'blocks']) {
    for (const group of dirs(path.join(root, top))) {
      for (const shelf of dirs(path.join(root, top, group))) {
        for (const name of dirs(path.join(root, top, group, shelf))) {
          const dir = `${top}/${group}/${shelf}/${name}`
          const meta = JSON.parse(readFileSync(path.join(root, dir, 'meta.json'), 'utf8'))
          items.push({ name, dir, top, group, shelf, meta })
        }
      }
    }
  }
  return items
}

/** variants.ts'i okur (Node tip ayıklamasıyla); yoksa boş dizi. */
export async function loadVariants(item) {
  const file = path.join(root, item.dir, 'variants.ts')
  if (!existsSync(file)) return []
  const mod = await import(`file://${file.split(path.sep).join('/')}`)
  return mod.variants ?? []
}

/** 'thinking-loader' → 'ThinkingLoader': component dosyasının ana export'u. */
export const exportName = (name) => name.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase())
