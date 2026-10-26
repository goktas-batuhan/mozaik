export interface Item {
  name: string
  dir: string
  top: 'registry' | 'blocks'
  group: string
  shelf: string
  meta: Record<string, unknown>
}
export const root: string
export const taxonomy: unknown
export function listItems(): Item[]
export function loadVariants(item: Item): Promise<{ name: string; title: string; props: Record<string, unknown> }[]>
export function exportName(name: string): string
