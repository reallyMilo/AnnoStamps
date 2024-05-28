import * as Headless from '@headlessui/react'
import React from 'react'

import { cn } from '@/lib/utils'

import { TouchTarget } from './Button'
import { Link } from './Link'

export const Navbar = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'nav'>) => {
  return (
    <nav
      {...props}
      className={cn('flex flex-1 items-center gap-4 py-2.5', className)}
    />
  )
}

export const NavbarDivider = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={cn('h-6 w-px bg-midnight/10 dark:bg-white/10', className)}
    />
  )
}

export const NavbarSection = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return <div {...props} className={cn('flex items-center gap-3', className)} />
}

export const NavbarSpacer = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={cn('-ml-4 flex-1', className)}
    />
  )
}

export const NavbarItem = React.forwardRef(
  (
    {
      current,
      className,
      children,
      htmlLink = false,
      ...props
    }: {
      children: React.ReactNode
      className?: string
      current?: boolean
      htmlLink?: boolean
    } & (
      | Omit<Headless.ButtonProps, 'className'>
      | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
    ),
    ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
  ) => {
    const classes = cn(
      // Base
      'relative flex min-w-0 items-center gap-3 rounded-lg p-2 text-left text-base/6 font-medium text-midnight sm:text-sm/5',
      // Leading icon/icon-only
      'data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-zinc-500 sm:data-[slot=icon]:*:size-5',
      // Trailing icon (down chevron or similar)
      'data-[slot=icon]:last:[&:not(:nth-child(2))]:*:ml-auto data-[slot=icon]:last:[&:not(:nth-child(2))]:*:size-5 sm:data-[slot=icon]:last:[&:not(:nth-child(2))]:*:size-4',
      // Avatar
      'data-[slot=avatar]:*:-m-0.5 data-[slot=avatar]:*:size-7 data-[slot=avatar]:*:[--avatar-radius:theme(borderRadius.DEFAULT)] data-[slot=avatar]:*:[--ring-opacity:10%] sm:data-[slot=avatar]:*:size-6',
      // Hover
      'data-[hover]:bg-midnight/5 data-[slot=icon]:*:data-[hover]:fill-midnight',
      // Active
      'data-[active]:bg-midnight/5 data-[slot=icon]:*:data-[active]:fill-midnight',
      // Dark mode
      'dark:text-white dark:data-[slot=icon]:*:fill-zinc-400',
      'dark:data-[hover]:bg-white/5 dark:data-[slot=icon]:*:data-[hover]:fill-white',
      'dark:data-[active]:bg-white/5 dark:data-[slot=icon]:*:data-[active]:fill-white'
    )

    return (
      <span className={cn('relative', className)}>
        {'href' in props ? (
          <Link
            {...props}
            className={classes}
            data-current={current ? 'true' : undefined}
            ref={ref as React.ForwardedRef<HTMLAnchorElement>}
            htmlLink={htmlLink}
          >
            <TouchTarget>{children}</TouchTarget>
          </Link>
        ) : (
          <Headless.Button
            {...props}
            className={cn('cursor-default', classes)}
            data-current={current ? 'true' : undefined}
            ref={ref}
          >
            <TouchTarget>{children}</TouchTarget>
          </Headless.Button>
        )}
      </span>
    )
  }
)
NavbarItem.displayName = 'NavbarItem'

export const NavbarLabel = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) => {
  return <span {...props} className={cn('truncate', className)} />
}
