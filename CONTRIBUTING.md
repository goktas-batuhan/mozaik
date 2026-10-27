# Contributing

Mozaik has three layers, all in one category tree:

- **Component:** one file, one job. Lives in `registry/<group>/<shelf>/<name>/`.
- **Variant:** a named prop set of an existing component. No new code: an entry in that component's `variants.ts`.
- **Block:** a ready-made page section built from Mozaik components and Tailwind. Lives in `blocks/<section>/<shelf>/<name>/`.

If a new piece is almost the same as an existing component, it is a variant, not a new component.

## Where things go

Groups, shelves and tag axes are listed in `registry/taxonomy.json`; the build rejects anything else. The tree follows what people look for (buttons, cards, backgrounds...), not technique or source repo. Every item sits on exactly one shelf; a second meaning goes in a tag. Example: `slide-to-confirm` lives in `buttons/confirm` and carries the `web3` tag.

```
registry/<group>/<shelf>/<name>/
  <name>.tsx        the component (one file; depends only on react, motion and `cn`)
  <name>.demo.tsx   default-exported demo, rendered by the playground and the site
  <name>.test.tsx   Vitest + Testing Library
  meta.json         see below
  variants.ts       optional: named prop sets

blocks/<section>/<shelf>/<name>/
  same files; the block imports other Mozaik components with `@/components/<name>`
```

`npm run registry:build` turns these into `registry.json`, `public/r/<name>.json`, `public/r/index.json` (the site's data) and `public/r/taxonomy.json`. You never edit `registry.json` by hand. Moving a folder needs no import changes: `npm run link` (run before dev, typecheck, test and gate) writes `src/components/<name>.ts` shortcuts, so `@/components/<name>` always resolves.

## meta.json

```json
{
  "name": "thinking-loader",
  "title": "Thinking Loader",
  "description": "One sentence.",
  "group": "feedback",
  "shelf": "loaders",
  "layer": "component",
  "tags": ["loop", "css", "ai"],
  "keywords": ["loader", "status", "dots"],
  "source": "original",
  "dependencies": ["motion"],
  "registryDependencies": [],
  "props": [{ "name": "variant", "type": "'dots' | 'bar' | 'grid'", "default": "'dots'", "description": "..." }]
}
```

- `group` and `shelf` match the folder. `layer` is `component` under `registry/` and `block` under `blocks/`.
- `tags` take values from three axes: **trigger** (hover, click, drag, scroll, loop, in-view, type), **tech** (css, svg, canvas, webgl, sound) and **theme** (web3, ai, dashboard, marketing). Two to six in total. The **weight** axis (zero-deps, motion, lucide) is added by the build from `dependencies` and the demo's imports; do not write it.
- `keywords` are free words for search.
- `registryDependencies` names other Mozaik items the file imports; the build turns them into registry URLs so `shadcn add` installs them too.

## Variants

`variants.ts` exports `variants`, typed with the component's props:

```ts
import type { ThinkingLoaderProps } from './thinking-loader'

export const variants: { name: string; title: string; description: string; props: ThinkingLoaderProps }[] = [
  { name: 'bar', title: 'Bar', description: 'A short bar that slides across a track.', props: { variant: 'bar', label: 'Searching the web' } },
]
```

- The preview is the component itself with `props` spread on it, so `props` must be complete enough to render and JSON-friendly (strings, numbers, booleans, arrays, plain objects).
- If the component needs JSX content (children, icons, slides), the demo file may also export `VariantPreview`: a component that takes the variant props and supplies that content, e.g. `export function VariantPreview(props: DockProps) { return <Dock {...props}>{icons}</Dock> }`. Previews and smoke tests then render `VariantPreview` instead of the bare component. The props stay JSON-friendly.
- `name` is kebab-case and unique within the component. The playground opens it at `?c=<name>&v=<variant>`.
- A variant must look or behave clearly differently. Colour-only changes are not variants.

## Blocks

- A block is a page section (hero, pricing, FAQ, footer...) in one of the sections in `taxonomy.json` (`marketing`, `app`, `pages`).
- It uses Mozaik components (imported with `@/components/<name>` and listed in `registryDependencies`) plus Tailwind; no other UI kits.
- It is published as `registry:block`. The same rules below apply: tokens, reduced motion, accessibility.

## Rules

- **Tokens only.** Colors come from the shadcn variable names (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`, `ring-ring`, ...). No hard-coded hex or Tailwind palette colors. Opacity modifiers (`bg-primary/20`) are fine. Canvas/WebGL code reads colors with `getComputedStyle`.
- **One API.** Shared prop names: `className`, `duration`, `delay`, `disabled`, `as`, `children`. Durations are seconds. The main export is the PascalCase name (`thinking-loader` → `ThinkingLoader`).
- **Reduced motion is required.** Read it with the small `usePrefersReducedMotion()` helper at the top of each component (`useReducedMotion() || useReducedMotionConfig()` from `motion/react`), also in canvas code. It follows the OS setting and can also be forced on from outside with `<MotionConfig reducedMotion="always">`; the site's preview toggle does exactly that. Under reduced motion the component renders a calm, static frame: the Playwright gate takes two screenshots 0.7s apart and fails if they differ.
- **Accessibility.** Real text stays in the DOM for screen readers: put the full string in a `<span className="sr-only">` and mark the animated letters `aria-hidden` (no `aria-label` on role-less elements; axe flags it). Interactive parts work with the keyboard and show a focus ring. Backgrounds are `pointer-events-none` and `aria-hidden`.
- **Cursor effects** turn off on touch devices (`(hover: hover) and (pointer: fine)`).
- **Canvas/rAF** loops stop when the element is off screen (IntersectionObserver) and are cancelled on unmount.
- **On-chain components** take data through props. No RPC, no wallet, no network.
- **Imports:** `motion/react`, `react`, `@/lib/utils`, other Mozaik items via `@/components/<name>`. Demos import their own component with `./<name>`.
- **English** for props, comments, docs and demo copy.

## Sources

- **Original:** written from scratch. `"source": "original"`.
- **Adapted:** rebuilt from a permissively licensed project (MIT, Apache-2.0, ISC, Unlicense). Re-read the upstream LICENSE before adapting. Put `// Source: <repo> (<license>)` on the first line of the component file, set `"source": { "repo": "owner/name", "license": "MIT", "url": "..." }` in `meta.json`; the build writes the row in `CREDITS.md`. Never copy from Commons Clause, custom-licensed or paid sources.

## Quality gate

`npm run gate` runs `tsc`, Vitest and the Playwright smoke test (renders without errors, holds still under reduced motion) for every component, block and variant. Passing items get the `stable` badge; the rest ship as `beta`. Variants have no unit test of their own; they need the component's tests and their own smoke test. In CI the smoke test can be split with `GATE_SHARD=1/4` (one report per shard in `.gate/`, merged by the gate).
