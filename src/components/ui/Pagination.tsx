import type React from 'react'

import { cn } from '@/lib/utils'

import { Button } from './Button'

export const Pagination = ({
  'aria-label': ariaLabel = 'Page navigation',
  className,
  ...props
}: React.ComponentPropsWithoutRef<'nav'>) => {
  return (
    <nav
      aria-label={ariaLabel}
      {...props}
      className={cn('flex gap-x-2', className)}
    />
  )
}

export const PaginationPrevious = ({
  children = '',
  className,
  href = null,
}: React.PropsWithChildren<{ className?: string; href?: null | string }>) => {
  return (
    <span className={cn('grow basis-0', className)}>
      <Button
        {...(href === null ? { disabled: true } : { href })}
        aria-label="Previous page"
        plain
      >
        <svg
          aria-hidden="true"
          className="stroke-current"
          data-slot="icon"
          fill="none"
          viewBox="0 0 16 16"
        >
          <path
            d="M2.75 8H13.25M2.75 8L5.25 5.5M2.75 8L5.25 10.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
          />
        </svg>
        {children}
      </Button>
    </span>
  )
}

export const PaginationNext = ({
  children = '',
  className,
  href = null,
}: React.PropsWithChildren<{ className?: string; href?: null | string }>) => {
  return (
    <span className={cn('flex grow basis-0 justify-end', className)}>
      <Button
        {...(href === null ? { disabled: true } : { href })}
        aria-label="Next page"
        plain
      >
        {children}
        <svg
          aria-hidden="true"
          className="stroke-current"
          data-slot="icon"
          fill="none"
          viewBox="0 0 16 16"
        >
          <path
            d="M13.25 8L2.75 8M13.25 8L10.75 10.5M13.25 8L10.75 5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
          />
        </svg>
      </Button>
    </span>
  )
}

export const PaginationList = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) => {
  return (
    <span
      {...props}
      className={cn('hidden items-baseline gap-x-2 sm:flex', className)}
    />
  )
}

export const PaginationPage = ({
  children,
  className,
  current = false,
  href,
}: React.PropsWithChildren<{
  className?: string
  current?: boolean
  href: string
}>) => {
  return (
    <Button
      aria-current={current ? 'page' : undefined}
      aria-label={`Page ${children}`}
      className={cn(
        'min-w-[2.25rem] before:absolute before:-inset-px before:rounded-lg',
        current && 'before:bg-midnight/5 dark:before:bg-white/10',
        className,
      )}
      href={href}
      plain
    >
      <span className="-mx-0.5">{children}</span>
    </Button>
  )
}

export const PaginationGap = ({
  children = <>&hellip;</>,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) => {
  return (
    <span
      aria-hidden="true"
      data-testid="pagination-gap"
      {...props}
      className={cn(
        'w-[2.25rem] select-none text-center text-sm/6 font-semibold text-midnight dark:text-white',
        className,
      )}
    >
      {children}
    </span>
  )
}
