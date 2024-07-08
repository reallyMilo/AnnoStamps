import * as Headless from '@headlessui/react'
import NextLink, { type LinkProps } from 'next/link'
import React from 'react'

export const Link = React.forwardRef(
  (
    props: { htmlLink?: boolean } & LinkProps &
      React.ComponentPropsWithoutRef<'a'>,
    ref: React.ForwardedRef<HTMLAnchorElement>,
  ) => {
    const { htmlLink, ...rest } = props
    if (htmlLink) {
      return (
        <Headless.DataInteractive>
          <a {...rest} ref={ref} target="_blank"></a>
        </Headless.DataInteractive>
      )
    }
    return (
      <Headless.DataInteractive>
        <NextLink prefetch={false} {...rest} ref={ref} />
      </Headless.DataInteractive>
    )
  },
)

Link.displayName = 'Link'
