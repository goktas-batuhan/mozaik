import { defineConfig, devices } from '@playwright/test'

// Paralel worktree'ler aynı makinede koşabilsin diye port ortamdan gelir.
const port = Number(process.env.GATE_PORT ?? 5199)

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: [['list'], ['json', { outputFile: '.gate/smoke.json' }]],
  use: { baseURL: `http://localhost:${port}`, ...devices['Desktop Chrome'] },
  webServer: {
    command: `npx vite --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
  },
})
