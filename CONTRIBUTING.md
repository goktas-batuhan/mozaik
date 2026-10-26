# Contributing a component

Every component lives in its own folder and follows the same shape:

```
registry/<category>/<name>/
  <name>.tsx        the component (one file; depends only on react, motion and `cn`)
  <name>.demo.tsx   default-exported demo, rendered by the playground and the site
  <name>.test.tsx   Vitest + Testing Library
  meta.json         name, title, description, category, layer, source, dependencies, props
```

`npm run registry:build` turns these into `registry.json` and `public/r/<name>.json`. You never edit `registry.json` by hand.

## Rules

- **Tokens only.** Colors come from the shadcn variable names (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`, `ring-ring`, ...). No hard-coded hex or Tailwind palette colors. Opacity modifiers (`bg-primary/20`) are fine. Canvas/WebGL code reads colors with `getComputedStyle`.
- **One API.** Shared prop names: `className`, `duration`, `delay`, `disabled`, `as`, `children`. Durations are seconds.
- **Reduced motion is required.** Read it with the small `usePrefersReducedMotion()` helper at the top of each component (`useReducedMotion() || useReducedMotionConfig()` from `motion/react`), also in canvas code. It follows the OS setting and can also be forced on from outside with `<MotionConfig reducedMotion="always">`; the site's preview toggle does exactly that. Under reduced motion the component renders a calm, static frame: the Playwright gate takes two screenshots 0.7s apart and fails if they differ.
- **Accessibility.** Real text stays in the DOM for screen readers: put the full string in a `<span className="sr-only">` and mark the animated letters `aria-hidden` (no `aria-label` on role-less elements; axe flags it). Interactive parts work with the keyboard and show a focus ring. Backgrounds are `pointer-events-none` and `aria-hidden`.
- **Cursor effects** turn off on touch devices (`(hover: hover) and (pointer: fine)`).
- **Canvas/rAF** loops stop when the element is off screen (IntersectionObserver) and are cancelled on unmount.
- **On-chain components** take data through props. No RPC, no wallet, no network.
- **Imports:** `motion/react`, `react`, `@/lib/utils`. Demos import the component with `./<name>`.
- **English** for props, comments, docs and demo copy.

## Layers and sources

- **A, original:** written from scratch. `"source": "original"`.
- **B, adapted:** rebuilt from a permissively licensed project (MIT, Apache-2.0, ISC, Unlicense). Re-read the upstream LICENSE before adapting. Put `// Source: <repo> (<license>)` on the first line of the component file, set `"source": { "repo": "owner/name", "license": "MIT", "url": "..." }` in `meta.json`, and add a row to `CREDITS.md`. Never copy from Commons Clause, custom-licensed or paid sources.

## Quality gate

`npm run gate` runs `tsc`, Vitest and the Playwright smoke test (renders without errors, holds still under reduced motion). Passing components get the `stable` badge; the rest ship as `beta`.
