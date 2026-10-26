// Kalite kapısı: tip kontrolü + Vitest + Playwright smoke. Component başına sonuç
// .gate/status.json'a yazılır (stable / beta); build-registry rozeti oradan okur.
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
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

const names = []
const registryDir = path.join(root, 'registry')
for (const cat of readdirSync(registryDir, { withFileTypes: true })) {
  if (!cat.isDirectory()) continue
  for (const dir of readdirSync(path.join(registryDir, cat.name), { withFileTypes: true })) {
    if (dir.isDirectory()) names.push({ name: dir.name, dir: `registry/${cat.name}/${dir.name}` })
  }
}

const typesOk = run('npx tsc -b --force')
run('npx vitest run --reporter=default --reporter=json --outputFile=.gate/unit.json')
run('npx playwright test')

const unit = existsSync(path.join(out, 'unit.json')) ? JSON.parse(readFileSync(path.join(out, 'unit.json'), 'utf8')) : { testResults: [] }
const smoke = existsSync(path.join(out, 'smoke.json')) ? JSON.parse(readFileSync(path.join(out, 'smoke.json'), 'utf8')) : { suites: [] }

const unitFailed = new Set()
const unitSeen = new Set()
for (const file of unit.testResults) {
  const rel = path.relative(root, file.name).split(path.sep).join('/')
  const hit = names.find((n) => rel.startsWith(n.dir + '/'))
  if (!hit) continue
  unitSeen.add(hit.name)
  if (file.status !== 'passed') unitFailed.add(hit.name)
}

const smokeFailed = new Set()
const smokeSeen = new Set()
const walk = (suite) => {
  for (const spec of suite.specs ?? []) {
    const name = spec.title.replace(/ (renders|holds still under reduced motion)$/, '')
    smokeSeen.add(name)
    if (!spec.ok) smokeFailed.add(name)
  }
  for (const s of suite.suites ?? []) walk(s)
}
for (const s of smoke.suites) walk(s)

const status = {}
for (const { name } of names) {
  const ok = typesOk && unitSeen.has(name) && !unitFailed.has(name) && smokeSeen.has(name) && !smokeFailed.has(name)
  status[name] = ok ? 'stable' : 'beta'
}
writeFileSync(path.join(out, 'status.json'), JSON.stringify(status, null, 2) + '\n')
const beta = Object.entries(status).filter(([, s]) => s === 'beta').map(([n]) => n)
console.log(`\ngate: ${names.length - beta.length}/${names.length} stable${beta.length ? `; beta: ${beta.join(', ')}` : ''}`)
if (!typesOk) console.log('gate: tip kontrolü başarısız, hepsi beta')
process.exitCode = typesOk ? 0 : 1
