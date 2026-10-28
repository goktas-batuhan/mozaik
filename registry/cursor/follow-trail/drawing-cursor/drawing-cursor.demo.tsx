import { DrawingCursor, type DrawingCursorProps } from './drawing-cursor'

export default function DrawingCursorDemo() {
  return <Area />
}

function Area(props: Omit<DrawingCursorProps, 'children'>) {
  return (
    <DrawingCursor
      className="flex h-[360px] w-[min(48rem,calc(100vw-4rem))] flex-col items-center justify-center rounded-2xl border bg-card px-8 text-center"
      {...props}
    >
      <h2 className="text-4xl font-semibold tracking-tight text-balance">Write on the air</h2>
      <p className="mt-3 max-w-md text-sm text-muted-foreground text-pretty">
        Move your cursor across the card. It leaves a line of ink that thins when you hurry and fades as it dries.
      </p>
    </DrawingCursor>
  )
}

export function VariantPreview(props: Omit<DrawingCursorProps, 'children'>) {
  return <Area {...props} />
}
