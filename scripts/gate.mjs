// Kalite kapısı: tip kontrolü + Vitest + Playwright smoke. Öğe ve varyant başına sonuç
// .gate/status.json'a yazılır (stable / beta; varyant anahtarı "<ad>/<varyant>");
// build-registry rozeti oradan okur. GATE_SHARD=1/4 gibi verilirse smoke yalnız o parçayı koşar
// (CI'da paralel iş); parçaların smoke.json'ları .gate/smoke-*.json olarak birleştirilir.
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { listItems, loadVariants, root } from './items.mjs'

const out = path.join(root, '.gate')
mkdirSync(out, { recursive: true })

const run = (cmd) => {
  try {
    execSync(cmd, { cwd: root, stdio: 'inherit' })
    return true
  } catch {
    return false
  }
}

const items = listItems()
const keys = []
for (const item of items) {
  keys.push({ key: item.name, item })
  for (const v of await loadVariants(item)) keys.push({ key: `${item.name}/${v.name}`, item })
}

run('node scripts/link-components.mjs')
const typesOk = run('npx tsc -b --force')
run('npx vitest run --reporter=default --reporter=json --outputFile=.gate/unit.json')
const shard = process.env.GATE_SHARD
// Parçasız koşuda eski parça raporları sonucu bozmasın.
if (!shard) for (const f of readdirSync(out)) if (/^smoke-.+\.json$/.test(f)) rmSync(path.join(out, f))
if (process.env.GATE_SMOKE !== 'skip') run(`npx playwright test${shard ? ` --shard=${shard}` : ''}`)

const unit = existsSync(path.join(out, 'unit.json')) ? JSON.parse(readFileSync(path.join(out, 'unit.json'), 'utf8')) : { testResults: [] }
const smokeFiles = readdirSync(out).filter((f) => /^smoke(-.+)?\.json$/.test(f))

const unitFailed = new Set()
const unitSeen = new Set()
for (const file of unit.testResults) {
  const rel = path.relative(root, file.name).split(path.sep).join('/')
  const hit = items.find((n) => rel.startsWith(n.dir + '/'))
  if (!hit) continue
  unitSeen.add(hit.name)
  if (file.status !== 'passed') unitFailed.add(hit.name)
}

const smokeFailed = new Set()
const smokeSeen = new Set()
const walk = (suite) => {
  for (const spec of suite.specs ?? []) {
    const key = spec.title.replace(/ (renders|holds still under reduced motion)$/, '')
    smokeSeen.add(key)
    if (!spec.ok) smokeFailed.add(key)
  }
  for (const s of suite.suites ?? []) walk(s)
}
for (const f of smokeFiles) for (const s of JSON.parse(readFileSync(path.join(out, f), 'utf8')).suites) walk(s)

// Varyantın birim testi yok: component'in testi geçerse yeter.
const status = {}
for (const { key, item } of keys) {
  const ok = typesOk && unitSeen.has(item.name) && !unitFailed.has(item.name) && smokeSeen.has(key) && !smokeFailed.has(key)
  status[key] = ok ? 'stable' : 'beta'
}
writeFileSync(path.join(out, 'status.json'), JSON.stringify(status, null, 2) + '\n')
const beta = Object.entries(status).filter(([, s]) => s === 'beta').map(([n]) => n)
console.log(`\ngate: ${keys.length - beta.length}/${keys.length} stable${beta.length ? `; beta: ${beta.join(', ')}` : ''}`)
if (!typesOk) console.log('gate: tip kontrolü başarısız, hepsi beta')
process.exitCode = typesOk ? 0 : 1
