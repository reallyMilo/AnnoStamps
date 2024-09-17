import {
  render as renderRTL,
  screen,
  userEvent,
} from '../../../../__tests__/test-utils'
import { CommentThread } from '../CommentThread'

const render = () => ({
  ...renderRTL(<CommentThread comments={[]} id={'test'} />),
  user: userEvent.setup(),
})

describe('CommentsForm', () => {
  it('initially renders with a single-row textarea and hidden buttons', () => {
    render()

    expect(screen.getByLabelText('Comment')).toHaveAttribute('rows', '1')
    expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument()
  })
  it('shows disabled submit button on textarea focus and hides it when not focused', async () => {
    render()

    await userEvent.click(screen.getByLabelText('Comment'))
    expect(screen.getByRole('button', { name: 'Comment' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Comment' })).toBeDisabled()

    await userEvent.click(document.body)
    expect(screen.queryByRole('button', { name: 'Comment' })).toBeNull()
  })

  it('enables submit button when textarea contains text and does not reset on offscreen click', async () => {
    render()

    const textarea = screen.getByLabelText('Comment')

    await userEvent.type(textarea, 'testing')
    expect(textarea).toHaveValue('testing')
    expect(screen.getByRole('button', { name: 'Comment' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Comment' })).toBeEnabled()

    await userEvent.click(document.body)
    expect(textarea).toHaveValue('testing')
    expect(screen.getByRole('button', { name: 'Comment' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Comment' })).toBeEnabled()
  })
})
