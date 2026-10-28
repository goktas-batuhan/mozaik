import { ClickRipple, type ClickRippleProps } from './click-ripple'

export default function ClickRippleDemo() {
  return <Area />
}

function Area(props: Omit<ClickRippleProps, 'children'>) {
  return (
    <ClickRipple
      className="flex h-[360px] w-[min(48rem,calc(100vw-4rem))] flex-col items-center justify-center rounded-2xl border bg-card px-8 text-center"
      {...props}
    >
      <h2 className="text-4xl font-semibold tracking-tight text-balance">Click anywhere</h2>
      <p className="mt-3 max-w-md text-sm text-muted-foreground text-pretty">
        Every click sends a pair of rings out from the cursor. They never block the content underneath.
      </p>
    </ClickRipple>
  )
}

export function VariantPreview(props: Omit<ClickRippleProps, 'children'>) {
  return <Area {...props} />
}
