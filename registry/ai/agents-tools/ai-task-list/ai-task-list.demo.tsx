import { AITaskList, type AITask } from './ai-task-list'

const PLAN: AITask[] = [
  { id: 'read', label: 'Read the failing test', status: 'done', note: '1 file' },
  {
    id: 'fix',
    label: 'Fix the date parser',
    status: 'running',
    children: [
      { id: 'fix-a', label: 'Handle time zones', status: 'done' },
      { id: 'fix-b', label: 'Handle leap days', status: 'running' },
    ],
  },
  { id: 'run', label: 'Run the whole suite', status: 'pending' },
  { id: 'docs', label: 'Update the changelog', status: 'failed', note: 'no access' },
]

export default function AITaskListDemo() {
  return (
    <div className="w-[min(92vw,420px)]">
      <AITaskList tasks={PLAN} label="Fix the parser" />
    </div>
  )
}
