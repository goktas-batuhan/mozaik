// Source: original
import { useId, type ElementType, type ReactNode } from 'react'
import { Terminal, TerminalLine, TerminalTyping } from '@/components/terminal'
import { cn } from '@/lib/utils'

export interface FeatureTerminalItem {
  /** Short name of the feature. */
  title: string
  /** One sentence. */
  description: ReactNode
}

export interface FeatureTerminalLine {
  /** The text of the line. */
  text: string
  /** `command` types itself out after a prompt; `output` fades in; `success` fades in with the success color. */
  kind?: 'command' | 'output' | 'success'
}

export interface FeaturesTerminalProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** Features listed beside the terminal. */
  features: FeatureTerminalItem[]
  /** What the terminal prints, in order. */
  lines: FeatureTerminalLine[]
  /** Text in the terminal title bar. */
  terminalTitle?: string
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  /** Shows every line in full, with no typing. */
  disabled?: boolean
  className?: string
}

/** Features in a list beside a terminal that types a command and prints the result. Built on Terminal. */
export function FeaturesTerminal({
  title,
  description,
  features,
  lines,
  terminalTitle = '~/project',
  titleAs: Title = 'h2',
  as: Tag = 'section',
  disabled = false,
  className,
}: FeaturesTerminalProps) {
  const id = useId()
  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="grid items-center gap-10 @3xl:grid-cols-2 @3xl:gap-14">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start gap-4">
            <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
              {title}
            </Title>
            {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
          </div>
          <ul className="flex flex-col gap-5">
            {features.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <span aria-hidden className="mt-1 font-mono text-sm text-primary">
                  &gt;
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Terminal title={terminalTitle} disabled={disabled} className="h-72 max-w-none">
          {lines.map((line, i) =>
            line.kind === 'command' ? (
              <TerminalTyping key={i}>{`$ ${line.text}`}</TerminalTyping>
            ) : (
              <TerminalLine key={i} className={line.kind === 'success' ? 'text-success' : 'text-muted-foreground'}>
                {line.text}
              </TerminalLine>
            ),
          )}
        </Terminal>
      </div>
    </Tag>
  )
}
