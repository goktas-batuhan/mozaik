// src/components/<ad>.ts kısayollarını üretir: blok ve demolar başka bir component'i
// `@/components/<ad>` ile çağırır (kurulumdaki yolla aynı). Klasör derinliği değişse de
// import'lar değişmez. Üretilir, gitignore'da; dev/typecheck/test/gate öncesi koşar.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { listItems, root } from './items.mjs'

const out = path.join(root, 'src/components')
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
const items = listItems()
for (const { name, dir } of items) {
  writeFileSync(path.join(out, `${name}.ts`), `export * from '../../${dir}/${name}'\n`)
}
console.log(`link: ${items.length} component kısayolu`)
