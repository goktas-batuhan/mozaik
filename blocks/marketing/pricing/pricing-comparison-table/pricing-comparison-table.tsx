// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { Fragment, useId, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface ComparisonPlan {
  /** Plan name shown in the column header. */
  name: string
  /** Price line under the name, e.g. "$29 / mo". */
  price: string
  /** Tints the column and fills its button. */
  highlight?: boolean
  /** Call to action under the price. A link when href is set, a button otherwise. */
  action: { label: string; href?: string; onClick?: () => void }
}

export interface ComparisonRow {
  /** Feature name. */
  label: string
  /** One value per plan: true (included), false (not included) or a short text such as "5 GB". */
  values: (boolean | string)[]
}

export interface ComparisonGroup {
  /** Group heading, e.g. "Collaboration". */
  name: string
  rows: ComparisonRow[]
}

export interface PricingComparisonTableProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Plans, one per column. */
  plans: ComparisonPlan[]
  /** Feature groups, each with its rows. */
  groups: ComparisonGroup[]
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === 'string') return <span className="text-sm text-foreground">{value}</span>
  if (!value) {
    return (
      <>
        <span aria-hidden className="text-muted-foreground/60">
          —
        </span>
        <span className="sr-only">Not included</span>
      </>
    )
  }
  return (
    <>
      <svg aria-hidden viewBox="0 0 16 16" className="mx-auto size-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3.5 8.5 3 3 6-7" />
      </svg>
      <span className="sr-only">Included</span>
    </>
  )
}

/** A feature matrix: plans as columns, grouped features as rows, one column tinted as the recommended plan. */
export function PricingComparisonTable({ title, description, plans, groups, as: Tag = 'section', disabled = false, className }: PricingComparisonTableProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const tint = (p: ComparisonPlan) => (p.highlight ? 'bg-primary/5' : '')

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 text-base text-pretty text-muted-foreground">{description}</p>}
      </div>

      <motion.div
        initial={animate ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-12 overflow-x-auto rounded-2xl border border-border bg-card"
      >
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <caption className="sr-only">Feature comparison between plans</caption>
          <thead>
            <tr className="border-b border-border">
              <td className="w-1/3 p-5" />
              {plans.map((plan) => (
                <th key={plan.name} scope="col" className={cn('p-5 text-center align-top font-normal', tint(plan))}>
                  <div className="text-base font-semibold text-card-foreground">{plan.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{plan.price}</div>
                  {(() => {
                    const cls = cn(
                      'mt-4 inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      plan.highlight
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
                    )
                    return plan.action.href ? (
                      <a href={plan.action.href} onClick={plan.action.onClick} className={cls}>
                        {plan.action.label}
                      </a>
                    ) : (
                      <button type="button" onClick={plan.action.onClick} className={cls}>
                        {plan.action.label}
                      </button>
                    )
                  })()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <Fragment key={group.name}>
                <tr>
                  <th scope="colgroup" colSpan={plans.length + 1} className="bg-muted/50 px-5 py-2.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {group.name}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <th scope="row" className="px-5 py-3.5 text-sm font-normal text-card-foreground">
                      {row.label}
                    </th>
                    {plans.map((plan, i) => (
                      <td key={plan.name} className={cn('px-5 py-3.5 text-center', tint(plan))}>
                        <Cell value={row.values[i] ?? false} />
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </motion.div>
    </Tag>
  )
}
