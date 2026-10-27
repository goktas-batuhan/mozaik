import type { TxStepsProps } from './tx-steps'

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: TxStepsProps }[] = [
  {
    name: 'vertical',
    title: 'Vertical',
    description: 'The steps stacked in a column with a connecting line, mid-swap.',
    props: {
      orientation: 'vertical',
      label: 'Swap progress',
      className: 'mx-auto w-[min(90vw,24rem)]',
      steps: [
        { label: 'Approve', description: 'Allow the router to spend USDC', status: 'done' },
        { label: 'Sign', description: 'Confirm the swap in your wallet', status: 'active' },
        { label: 'Broadcast', description: 'Sent to the network', status: 'pending' },
        { label: 'Confirmed', description: 'Included in block 21,408,117', status: 'pending' },
      ],
    },
  },
  {
    name: 'failed',
    title: 'Failed step',
    description: 'A row of steps where the wallet rejection stops the flow on an error state.',
    props: {
      label: 'Swap progress',
      className: 'w-[min(92vw,680px)]',
      steps: [
        { label: 'Approve', description: 'Allow the router to spend USDC', status: 'done' },
        { label: 'Sign', description: 'Rejected in wallet. Try again.', status: 'error' },
        { label: 'Broadcast', description: 'Sent to the network', status: 'pending' },
        { label: 'Confirmed', description: 'Included in block 21,408,117', status: 'pending' },
      ],
    },
  },
]
