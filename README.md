# Mozaik

**71 animated React components in one design language, distributed as a shadcn registry.**

Every component is accessible, follows `prefers-reduced-motion`, runs on a shared token layer and installs into your project as plain source code with one command.

Live gallery and docs: **https://goktas-batuhan.github.io/mozaik-site/** ([source](https://github.com/goktas-batuhan/mozaik-site))

```bash
npx shadcn@latest add https://raw.githubusercontent.com/goktas-batuhan/mozaik/main/public/r/rolling-text.json
```

## What is inside

| Category | Count | Examples |
| --- | --- | --- |
| Text | 13 | rolling-text, scramble-text, split-flap-text, morphing-text, spoiler-text |
| Background | 11 | shader-background (raw WebGL), aurora-background, topo-background, halftone-background, dot-grid |
| Cursor | 6 | magnetic, spotlight, smooth-cursor, cool-mode, tilt-card |
| Interactive | 10 | dock, direction-aware-tabs, hold-action-button, lens, shimmer-button |
| Layout | 9 | marquee, terminal, animated-list, progressive-blur, drag-carousel |
| Feedback | 9 | dynamic-island, notification-stack, ai-reasoning, thinking-loader, progress-ring |
| Blocks | 5 | hero-section, bento-grid, animated-beam, uptime-card, ai-tool-approval |
| On-chain | 8 | price-ticker, tx-steps, slide-to-confirm, amount-pad, order-book |

Two layers:

- **Original (14):** written from scratch for Mozaik.
- **Adapted (57):** rebuilt from MIT-licensed projects (Magic UI, cult-ui, kokonutui, ui-layouts, smoothui, beui, opensourceui). Each file names its source and license on the first line, and [CREDITS.md](CREDITS.md) lists them all.

## Install

Any React project with Tailwind CSS v4 and a `components.json` (run `npx shadcn@latest init` once) can install a component by URL:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/goktas-batuhan/mozaik/main/public/r/<name>.json
```

Or register the namespace once in `components.json`:

```json
{
  "registries": {
    "@mozaik": "https://raw.githubusercontent.com/goktas-batuhan/mozaik/main/public/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @mozaik/price-ticker
```

The CLI writes the component into your project, installs its npm dependencies (usually just `motion`) and rewrites import aliases. From then on the code is yours.

## Design rules

- **Tokens only.** Colors come from the shadcn variable names (`bg-background`, `text-primary`, `border-border`...), so components pick up your theme, light and dark.
- **Reduced motion is tested, not promised.** Each component reads the OS setting (and `<MotionConfig reducedMotion="always">`). The quality gate takes two screenshots 0.7s apart under reduced motion and fails if anything moved.
- **Accessible by default.** Real text stays in the DOM, decorative layers are `aria-hidden`, interactive parts work with a keyboard.
- **Cheap when idle.** Canvas and WebGL loops pause off screen; cursor effects switch off on touch devices.
- **On-chain components take data through props.** No RPC, no wallet, no network.

## Quality gate

```bash
npm run gate
```

1. `tsc -b`: strict TypeScript across components, demos and tests.
2. Vitest + Testing Library: 165 tests on roles, labels, props and reduced-motion paths.
3. Playwright: every demo renders without runtime errors, and holds still under reduced motion.

Components that pass get a `stable` badge, the rest ship as `beta`. Current status: **71 / 71 stable**. CI runs the same gate on every push.

## Project structure

```
registry/<category>/<name>/
  <name>.tsx        the component
  <name>.demo.tsx   demo used by the playground and the gallery site
  <name>.test.tsx   unit tests
  meta.json         title, description, layer, source, props
scripts/
  build-registry.mjs  meta.json -> registry.json -> public/r/*.json, CREDITS.md
  gate.mjs            typecheck + unit + smoke -> stable/beta badges
tests/smoke.spec.ts   Playwright smoke and reduced-motion check
src/playground/       local playground (npm run dev, ?c=<name> opens one demo)
```

## Development

```bash
npm install
npm run dev              # playground at http://localhost:5173
npm run gate             # quality gate
npm run registry:build   # rebuild public/r and CREDITS.md
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the component checklist.

## Tech

React 19 · TypeScript · Tailwind CSS v4 · Motion · Vite · Vitest · Playwright · GitHub Actions · shadcn registry

## License

MIT. Adapted components keep the notices of their upstream projects; see [CREDITS.md](CREDITS.md).
