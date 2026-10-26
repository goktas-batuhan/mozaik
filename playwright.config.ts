import { defineConfig, devices } from '@playwright/test'

// Paralel worktree'ler aynı makinede koşabilsin diye port ortamdan gelir.
const port = Number(process.env.GATE_PORT ?? 5199)
// CI'da parça başına ayrı rapor (GATE_SHARD=2/4 → smoke-2of4.json); gate hepsini birleştirir.
const shard = process.env.GATE_SHARD?.replace('/', 'of')

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: [['list'], ['json', { outputFile: `.gate/smoke${shard ? `-${shard}` : ''}.json` }]],
  use: { baseURL: `http://localhost:${port}`, ...devices['Desktop Chrome'] },
  webServer: {
    command: `npx vite --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
  },
})
