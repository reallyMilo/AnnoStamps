import { useOptimistic } from 'react'

import {
  render as renderRTL,
  screen,
  userEvent,
} from '../../../../__tests__/test-utils'
import { CommentForm } from '../CommentForm'

// mocking both due to nextjs using its own react version
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useOptimistic: vi.fn(() => [null, () => {}]),
  }
})
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    useFormStatus: vi.fn(() => [null, () => {}]),
  }
})
vi.mocked(useOptimistic).mockReturnValue([[], () => {}])

const user = {
  biography: null,
  id: '1',
  username: 'test123',
  usernameURL: 'test123',
}
const mockAction = async (): Promise<{ message: string; ok: boolean }> => {
  return { message: 'Test message', ok: true }
}
describe('CommentForm', () => {
  describe('Add a comment to stamp', () => {
    const render = () => ({
      ...renderRTL(
        <CommentForm.Root>
          <CommentForm.Form action={mockAction}>
            <CommentForm.FormActionButtons>
              Comment
            </CommentForm.FormActionButtons>
          </CommentForm.Form>
        </CommentForm.Root>,
        { user },
      ),
      user: userEvent.setup(),
    })

    it('renders textarea with hidden buttons initially, and shows buttons on focus', async () => {
      render()
      const textarea = screen.getByLabelText('Comment')

      expect(
        screen.getByPlaceholderText('Add a comment...'),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Comment' }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Cancel' }),
      ).not.toBeInTheDocument()

      await userEvent.click(textarea)
      expect(screen.getByRole('button', { name: 'Comment' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Comment' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled()
    })

    it('enables submit button when text is entered and clears form on cancel', async () => {
      render()
      const textarea = screen.getByLabelText('Comment')
      await userEvent.type(textarea, 'testing')
      expect(textarea).toHaveValue('testing')
      expect(screen.getByRole('button', { name: 'Comment' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Comment' })).toBeEnabled()
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    })
  })
  describe('Add a reply to a comment', () => {
    const render = () => ({
      ...renderRTL(
        <CommentForm.Root isVisible={false}>
          <CommentForm.ShowFormButton>
            <CommentForm.Form action={mockAction}>
              <CommentForm.FormActionButtons>
                Reply
              </CommentForm.FormActionButtons>
            </CommentForm.Form>
          </CommentForm.ShowFormButton>
        </CommentForm.Root>,
        { user },
      ),
      user: userEvent.setup(),
    })
    it('displays only the Reply button when the form is initially hidden', () => {
      render()

      expect(screen.getByRole('button', { name: 'Reply' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Reply' })).toBeEnabled()
      expect(screen.queryByLabelText('Comment')).not.toBeInTheDocument()
    })
    it('expands the form and focuses on textarea when Reply button is clicked', async () => {
      render()
      await userEvent.click(screen.getByRole('button', { name: 'Reply' }))

      expect(
        screen.getByPlaceholderText('Add a comment...'),
      ).toBeInTheDocument()
      expect(screen.getByLabelText('Comment')).toHaveFocus()
      expect(screen.getByTestId('comment-submit-button')).toBeVisible()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible()

      await userEvent.click(screen.getByTestId('comment-reply-button'))
      expect(screen.getByLabelText('Comment')).toHaveFocus()
    })
    it('hides the expanded form when Cancel button is clicked', async () => {
      render()

      await userEvent.click(screen.getByRole('button', { name: 'Reply' }))
      await userEvent.type(screen.getByLabelText('Comment'), 'testing')
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(screen.queryByLabelText('Comment')).not.toBeInTheDocument()
    })
  })
})
