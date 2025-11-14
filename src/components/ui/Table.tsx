'use client'

import type React from 'react'

import { createContext, useContext, useState } from 'react'

import { cn } from '@/lib/utils'

import { Link } from './Link'

const TableContext = createContext<{
  bleed: boolean
  dense: boolean
  grid: boolean
  striped: boolean
}>({
  bleed: false,
  dense: false,
  grid: false,
  striped: false,
})

export const Table = ({
  bleed = false,
  children,
  className,
  dense = false,
  grid = false,
  striped = false,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  bleed?: boolean
  dense?: boolean
  grid?: boolean
  striped?: boolean
}) => {
  return (
    <TableContext.Provider
      value={
        { bleed, dense, grid, striped } as React.ContextType<
          typeof TableContext
        >
      }
    >
      <div className="flow-root">
        <div
          {...props}
          className={cn(
            '-mx-(--gutter) overflow-x-auto whitespace-nowrap',
            className,
          )}
        >
          <div
            className={cn(
              'inline-block min-w-full align-middle',
              !bleed && 'sm:px-(--gutter)',
            )}
          >
            <table className="text-midnight min-w-full text-left text-sm/6 dark:text-white">
              {children}
            </table>
          </div>
        </div>
      </div>
    </TableContext.Provider>
  )
}

export const TableHead = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'thead'>) => {
  return (
    <thead
      {...props}
      className={cn('text-zinc-500 dark:text-zinc-400', className)}
    />
  )
}

export const TableBody = (props: React.ComponentPropsWithoutRef<'tbody'>) => {
  return <tbody {...props} />
}

const TableRowContext = createContext<{
  href?: string
  target?: string
  title?: string
}>({
  href: undefined,
  target: undefined,
  title: undefined,
})

export const TableRow = ({
  className,
  href,
  target,
  title,
  ...props
}: React.ComponentPropsWithoutRef<'tr'> & {
  href?: string
  target?: string
  title?: string
}) => {
  const { striped } = useContext(TableContext)

  return (
    <TableRowContext.Provider
      value={
        { href, target, title } as React.ContextType<typeof TableRowContext>
      }
    >
      <tr
        {...props}
        className={cn(
          href &&
            'has-[[data-row-link][data-focus]]:outline has-[[data-row-link][data-focus]]:outline-2 has-[[data-row-link][data-focus]]:-outline-offset-2 has-[[data-row-link][data-focus]]:outline-blue-500 dark:focus-within:bg-white/[2.5%]',
          striped && 'even:bg-midnight/[2.5%] dark:even:bg-white/[2.5%]',
          href && striped && 'hover:bg-midnight/5 dark:hover:bg-white/5',
          href &&
            !striped &&
            'hover:bg-midnight/[2.5%] dark:hover:bg-white/[2.5%]',
          className,
        )}
      />
    </TableRowContext.Provider>
  )
}

export const TableHeader = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'th'>) => {
  const { bleed, grid } = useContext(TableContext)

  return (
    <th
      {...props}
      className={cn(
        'border-b-midnight/10 border-b px-4 py-2 font-medium first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2)) dark:border-b-white/10',
        grid &&
          'border-l-midnight/5 border-l first:border-l-0 dark:border-l-white/5',
        !bleed && 'sm:first:pl-1 sm:last:pr-1',
        className,
      )}
    />
  )
}

export const TableCell = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'td'>) => {
  const { bleed, dense, grid, striped } = useContext(TableContext)
  const { href, target, title } = useContext(TableRowContext)
  const [cellRef, setCellRef] = useState<HTMLElement | null>(null)

  return (
    <td
      ref={href ? setCellRef : undefined}
      {...props}
      className={cn(
        'relative px-4 first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))',
        !striped && 'border-midnight/5 border-b dark:border-white/5',
        grid &&
          'border-l-midnight/5 border-l first:border-l-0 dark:border-l-white/5',
        dense ? 'py-2.5' : 'py-4',
        !bleed && 'sm:first:pl-1 sm:last:pr-1',
        className,
      )}
    >
      {href && (
        <Link
          aria-label={title}
          className="absolute inset-0 focus:outline-hidden"
          data-row-link
          href={href}
          tabIndex={cellRef?.previousElementSibling === null ? 0 : -1}
          target={target}
        />
      )}
      {children}
    </td>
  )
}
