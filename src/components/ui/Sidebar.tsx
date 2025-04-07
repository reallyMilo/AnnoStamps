'use client'

import * as Headless from '@headlessui/react'
import React, { Fragment } from 'react'

import { cn } from '@/lib/utils'

import { TouchTarget } from './Button'
import { Link } from './Link'

export const Sidebar = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'nav'>) => {
  return <nav {...props} className={cn('flex h-full flex-col', className)} />
}

export const SidebarHeader = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-col border-b border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5',
        className,
      )}
    />
  )
}

export const SidebarBody = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-1 flex-col overflow-y-auto p-4 [&>[data-slot=section]+[data-slot=section]]:mt-8',
        className,
      )}
    />
  )
}

export const SidebarFooter = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-col border-t border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5',
        className,
      )}
    />
  )
}

export const SidebarSection = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      {...props}
      className={cn('flex flex-col gap-0.5', className)}
      data-slot="section"
    />
  )
}

export const SidebarDivider = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'hr'>) => {
  return (
    <hr
      {...props}
      className={cn(
        'my-4 border-t border-zinc-950/5 lg:-mx-4 dark:border-white/5',
        className,
      )}
    />
  )
}

export const SidebarSpacer = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={cn('mt-8 flex-1', className)}
    />
  )
}

export const SidebarHeading = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h3'>) => {
  return (
    <h3
      {...props}
      className={cn(
        'mb-1 px-2 text-xs/6 font-medium text-zinc-500 dark:text-zinc-400',
        className,
      )}
    />
  )
}

export const SidebarItem = React.forwardRef(
  (
    {
      children,
      className,
      current,
      ...props
    }: { children: React.ReactNode; className?: string; current?: boolean } & (
      | Omit<Headless.ButtonProps, 'className'>
      | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className' | 'type'>
    ),
    ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    const classes = cn(
      // Base
      'flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5',
      // Leading icon/icon-only
      '*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-zinc-500 sm:*:data-[slot=icon]:size-5',
      // Trailing icon (down chevron or similar)
      '*:last:data-[slot=icon]:ml-auto *:last:data-[slot=icon]:size-5 sm:*:last:data-[slot=icon]:size-4',
      // Avatar
      '*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 *:data-[slot=avatar]:[--ring-opacity:10%] sm:*:data-[slot=avatar]:size-6',
      // Hover
      'data-hover:bg-zinc-950/5 data-hover:*:data-[slot=icon]:fill-zinc-950',
      // Active
      'data-active:bg-zinc-950/5 data-active:*:data-[slot=icon]:fill-zinc-950',
      // Current
      'data-current:*:data-[slot=icon]:fill-zinc-950',
      // Dark mode
      'dark:text-white dark:*:data-[slot=icon]:fill-zinc-400',
      'dark:data-hover:bg-white/5 dark:data-hover:*:data-[slot=icon]:fill-white',
      'dark:data-active:bg-white/5 dark:data-active:*:data-[slot=icon]:fill-white',
      'dark:data-current:*:data-[slot=icon]:fill-white',
    )

    return (
      <span className={cn('relative', className)}>
        {'href' in props ? (
          <Headless.CloseButton as={Fragment} ref={ref}>
            <Link
              className={classes}
              {...props}
              data-current={current ? 'true' : undefined}
            >
              <TouchTarget>{children}</TouchTarget>
            </Link>
          </Headless.CloseButton>
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
  },
)
SidebarItem.displayName = 'SidebarItem'

export const SidebarLabel = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) => {
  return <span {...props} className={cn('truncate', className)} />
}
