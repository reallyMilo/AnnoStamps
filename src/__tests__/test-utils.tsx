import type { Session } from 'next-auth'
import type { ReactElement } from 'react'

import { render, type RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { Suspense } from 'react'

const customRender = (
  // eslint-disable-next-line
  ui: ReactElement<any>,
  session: null | Session = null,
  options: RenderOptions = {},
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <Suspense>
        <SessionProvider session={session}>{children}</SessionProvider>
      </Suspense>
    ),
    ...options,
  })

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

export { customRender as render }
