import { GlyphMatrix } from './glyph-matrix'

export default function GlyphMatrixDemo() {
  return (
    <GlyphMatrix className="flex h-[500px] w-[min(900px,calc(100vw-4rem))] flex-col items-center justify-center rounded-2xl border px-8 text-center">
      <h2 className="max-w-xl text-5xl font-semibold tracking-tight text-balance">Machine language</h2>
      <p className="mt-4 max-w-md text-base text-muted-foreground text-pretty">
        A quiet field of glyphs that rewrite themselves a few at a time, fading out towards the bottom.
      </p>
    </GlyphMatrix>
  )
}
