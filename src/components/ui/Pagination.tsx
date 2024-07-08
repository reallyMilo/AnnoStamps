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
  href = null,
  className,
  children = '',
}: React.PropsWithChildren<{ className?: string; href?: string | null }>) => {
  return (
    <span className={cn('grow basis-0', className)}>
      <Button
        {...(href === null ? { disabled: true } : { href })}
        plain
        aria-label="Previous page"
      >
        <svg
          className="stroke-current"
          data-slot="icon"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2.75 8H13.25M2.75 8L5.25 5.5M2.75 8L5.25 10.5"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {children}
      </Button>
    </span>
  )
}

export const PaginationNext = ({
  href = null,
  className,
  children = '',
}: React.PropsWithChildren<{ className?: string; href?: string | null }>) => {
  return (
    <span className={cn('flex grow basis-0 justify-end', className)}>
      <Button
        {...(href === null ? { disabled: true } : { href })}
        plain
        aria-label="Next page"
      >
        {children}
        <svg
          className="stroke-current"
          data-slot="icon"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M13.25 8L2.75 8M13.25 8L10.75 10.5M13.25 8L10.75 5.5"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
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
  href,
  className,
  current = false,
  children,
}: React.PropsWithChildren<{
  className?: string
  current?: boolean
  href: string
}>) => {
  return (
    <Button
      href={href}
      plain
      aria-label={`Page ${children}`}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'min-w-[2.25rem] before:absolute before:-inset-px before:rounded-lg',
        current && 'before:bg-midnight/5 dark:before:bg-white/10',
        className,
      )}
    >
      <span className="-mx-0.5">{children}</span>
    </Button>
  )
}

export const PaginationGap = ({
  className,
  children = <>&hellip;</>,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) => {
  return (
    <span
      data-testid="pagination-gap"
      aria-hidden="true"
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
