import { FeaturesStickyList } from './features-sticky-list'

function Visual({ kind }: { kind: 'chart' | 'list' | 'grid' }) {
  return (
    <div aria-hidden className="grid h-44 place-items-center px-8">
      {kind === 'chart' && (
        <svg viewBox="0 0 240 100" className="h-28 w-full max-w-sm" fill="none">
          <path d="M0 80 40 60 80 70 120 40 160 50 200 20 240 30" className="stroke-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M0 80 40 60 80 70 120 40 160 50 200 20 240 30V100H0z" className="fill-primary/10" />
        </svg>
      )}
      {kind === 'list' && (
        <div className="w-full max-w-sm space-y-3">
          {[90, 70, 80].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className={`size-4 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted-foreground/25'}`} />
              <span style={{ width: `${w}%` }} className="h-2.5 rounded-full bg-muted-foreground/20" />
            </div>
          ))}
        </div>
      )}
      {kind === 'grid' && (
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 18 }, (_, i) => (
            <span key={i} className={`size-7 rounded-md ${i % 4 === 0 ? 'bg-primary/70' : 'bg-muted-foreground/15'}`} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FeaturesStickyListDemo() {
  return (
    <div className="w-full max-w-5xl">
      <FeaturesStickyList
        title="Powerful where it matters"
        description="Three ideas that shape every part of the product. Scroll to read on."
        action={{ label: 'See the full feature list', href: '#' }}
        features={[
          { tag: 'Insight', title: 'Charts that read themselves', description: 'Trends are summarized in plain language next to the data.', visual: <Visual kind="chart" /> },
          { tag: 'Focus', title: 'Lists that clear themselves', description: 'Finished work fades away so the next task is always on top.', visual: <Visual kind="list" /> },
          { tag: 'Scale', title: 'Grids that keep up', description: 'Thousands of rows stay smooth with virtual scrolling built in.', visual: <Visual kind="grid" /> },
        ]}
      />
    </div>
  )
}
