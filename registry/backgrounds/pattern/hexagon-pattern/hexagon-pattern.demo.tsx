import { HexagonPattern } from './hexagon-pattern'

export default function HexagonPatternDemo() {
  return (
    <HexagonPattern
      radius={32}
      highlight={[[3, 2], [4, 3], [6, 1], [8, 4], [10, 2], [11, 5]]}
      className="flex h-[500px] w-[min(900px,calc(100vw-4rem))] flex-col items-center justify-center rounded-2xl border px-8 text-center"
    >
      <h2 className="max-w-xl text-5xl font-semibold tracking-tight text-balance">Built like a hive</h2>
      <p className="mt-4 max-w-md text-base text-muted-foreground text-pretty">
        A honeycomb of hairlines that fades towards the edges, with a few cells lit in the primary color.
      </p>
    </HexagonPattern>
  )
}
