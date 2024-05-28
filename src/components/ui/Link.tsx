import * as Headless from '@headlessui/react'
import NextLink, { type LinkProps } from 'next/link'
import React from 'react'

export const Link = React.forwardRef(
  (
    props: { htmlLink?: boolean } & LinkProps &
      React.ComponentPropsWithoutRef<'a'>,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    if (props.htmlLink) {
      return (
        <Headless.DataInteractive>
          <a {...props} ref={ref}></a>
        </Headless.DataInteractive>
      )
    }
    return (
      <Headless.DataInteractive>
        <NextLink prefetch={false} {...props} ref={ref} />
      </Headless.DataInteractive>
    )
  }
)

Link.displayName = 'Link'
