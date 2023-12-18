import { render, RenderOptions } from '@testing-library/react'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ReactElement } from 'react'

const customRender = (
  ui: ReactElement,
  session: Session | null = null,
  options: RenderOptions = {}
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <SessionProvider session={session}>{children}</SessionProvider>
    ),
    ...options,
  })

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

export { customRender as render }
