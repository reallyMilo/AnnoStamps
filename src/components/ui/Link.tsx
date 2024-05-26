import * as Headless from '@headlessui/react'
import NextLink, { type LinkProps } from 'next/link'
import React from 'react'

export const Link = React.forwardRef(
  (
    props: LinkProps & React.ComponentPropsWithoutRef<'a'>,
    ref: React.ForwardedRef<HTMLAnchorElement>
  ) => {
    return (
      <Headless.DataInteractive>
        <NextLink {...props} ref={ref} />
      </Headless.DataInteractive>
    )
  }
)

Link.displayName = 'Link'
