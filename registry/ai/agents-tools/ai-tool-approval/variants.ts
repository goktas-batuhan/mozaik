import type { AIToolApprovalProps } from './ai-tool-approval'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: AIToolApprovalProps }[] = [
  { name: 'approved', title: 'Approved', description: 'The settled state after the reader approves the command.', props: { tool: 'bash', title: 'Run a command', input: 'npm test -- checkout', reason: 'Check the checkout tests before changing the form.', decision: 'approved' } },
  { name: 'denied', title: 'Denied', description: 'The settled state after the reader denies a risky command.', props: { tool: 'bash', title: 'Run a command', input: 'rm -rf .next && npm run build', reason: 'Clear the stale build cache, then rebuild.', destructive: true, decision: 'denied' } },
  { name: 'field-list', title: 'Field list', description: 'A structured call whose input shows as labelled fields instead of a command.', props: { tool: 'write_file', title: 'Write a file', input: { path: 'src/checkout/form.tsx', mode: 'overwrite', lines: 84, backup: true }, reason: 'Apply the validation fix to the checkout form.' } },
]
