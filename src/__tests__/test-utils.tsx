import type { Session } from 'next-auth'
import type { ReactElement } from 'react'

import { render, type RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { Suspense } from 'react'

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

const customRender = (
  ui: ReactElement,
  session: null | RecursivePartial<Session> = null,
  options: RenderOptions = {},
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <Suspense>
        <SessionProvider session={session as Session}>
          {children}
        </SessionProvider>
      </Suspense>
    ),
    ...options,
  })

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

export { customRender as render }
