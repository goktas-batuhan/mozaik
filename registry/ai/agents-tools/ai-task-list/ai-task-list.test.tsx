import { render, screen } from '@testing-library/react'
import { AITaskList, type AITask } from './ai-task-list'

const tasks: AITask[] = [
  { id: 'a', label: 'Read', status: 'done' },
  { id: 'b', label: 'Write', status: 'running', children: [{ id: 'b1', label: 'Draft', status: 'done' }, { id: 'b2', label: 'Polish', status: 'pending' }] },
  { id: 'c', label: 'Ship', status: 'failed', note: 'no access' },
]

describe('AITaskList', () => {
  it('lists every row including sub-steps', () => {
    render(<AITaskList tasks={tasks} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    expect(screen.getByText('Polish', { exact: false })).toBeInTheDocument()
  })

  it('counts done rows from the data, sub-steps included', () => {
    render(<AITaskList tasks={tasks} />)
    expect(screen.getByText('2/5', { exact: false })).toBeInTheDocument()
  })

  it('says each status in text for screen readers', () => {
    render(<AITaskList tasks={tasks} />)
    expect(screen.getByText('(Failed)')).toHaveClass('sr-only')
    expect(screen.getByText('(Running)')).toHaveClass('sr-only')
  })

  it('shows notes and a custom heading', () => {
    render(<AITaskList tasks={tasks} label="Release" />)
    expect(screen.getByText('Release')).toBeInTheDocument()
    expect(screen.getByText('no access')).toBeInTheDocument()
  })
})
