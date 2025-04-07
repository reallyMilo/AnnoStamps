import * as Headless from '@headlessui/react'
import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

export const InputGroup = ({
  children,
  className,
}: React.ComponentPropsWithoutRef<'span'>) => {
  return (
    <span
      className={cn(
        'relative isolate block',
        'has-[[data-slot=icon]:first-child]:[&_input]:pl-10 has-[[data-slot=icon]:last-child]:[&_input]:pr-10 sm:has-[[data-slot=icon]:first-child]:[&_input]:pl-8 sm:has-[[data-slot=icon]:last-child]:[&_input]:pr-8',
        '*:data-[slot=icon]:absolute *:data-[slot=icon]:top-3 *:data-[slot=icon]:z-10 *:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:top-2.5 sm:*:data-[slot=icon]:size-4',
        '[&>[data-slot=icon]:first-child]:left-3 sm:[&>[data-slot=icon]:first-child]:left-2.5 [&>[data-slot=icon]:last-child]:right-3 sm:[&>[data-slot=icon]:last-child]:right-2.5',
        '*:data-[slot=icon]:text-zinc-500 dark:*:data-[slot=icon]:text-zinc-400',
        // hack for text
        'has-[[data-slot=custom-text]:first-child]:[&_input]:pl-[165px] has-[[data-slot=custom-text]:last-child]:[&_input]:pr-10',
        '*:data-[slot=custom-text]:absolute *:data-[slot=custom-text]:top-[11px] *:data-[slot=custom-text]:z-10 sm:*:data-[slot=custom-text]:top-[7px]',
        '[&>[data-slot=custom-text]:first-child]:left-3',
        '*:data-[slot=custom-text]:text-zinc-500 dark:*:data-[slot=custom-text]:text-zinc-400',
        className,
      )}
      data-slot="control"
    >
      {children}
    </span>
  )
}

const dateTypes = ['date', 'datetime-local', 'month', 'time', 'week']
type DateType = (typeof dateTypes)[number]

export const Input = forwardRef(
  (
    {
      className,
      ...props
    }: {
      className?: string
      type?:
        | 'email'
        | 'number'
        | 'password'
        | 'search'
        | 'tel'
        | 'text'
        | 'url'
        | DateType
    } & Omit<Headless.InputProps, 'className'>,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <span
        className={cn([
          // Basic layout
          'relative block w-full',
          // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
          'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm',
          // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
          'dark:before:hidden',
          // Focus ring
          'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset sm:focus-within:after:ring-2 sm:focus-within:after:ring-blue-500',
          // Disabled state
          'has-data-disabled:before:bg-midnight/5 has-data-disabled:opacity-50 has-data-disabled:before:shadow-none',
          // Invalid state
          'has-data-invalid:before:shadow-red-500/10',
          className,
        ])}
        data-slot="control"
      >
        <Headless.Input
          ref={ref}
          {...props}
          className={cn([
            // Date classes
            props.type &&
              dateTypes.includes(props.type) && [
                '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
                '[&::-webkit-date-and-time-value]:min-h-[1.5em]',
                '[&::-webkit-datetime-edit]:inline-flex',
                '[&::-webkit-datetime-edit]:p-0',
                '[&::-webkit-datetime-edit-year-field]:p-0',
                '[&::-webkit-datetime-edit-month-field]:p-0',
                '[&::-webkit-datetime-edit-day-field]:p-0',
                '[&::-webkit-datetime-edit-hour-field]:p-0',
                '[&::-webkit-datetime-edit-minute-field]:p-0',
                '[&::-webkit-datetime-edit-second-field]:p-0',
                '[&::-webkit-datetime-edit-millisecond-field]:p-0',
                '[&::-webkit-datetime-edit-meridiem-field]:p-0',
              ],
            // Basic layout
            'relative block w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
            // Typography
            'text-midnight text-base/6 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white',
            // Border
            'border-midnight/10 data-hover:border-midnight/20 border dark:border-white/10 dark:data-hover:border-white/20',
            // Background color
            'bg-transparent dark:bg-white/5',
            // Hide default focus styles
            'focus:outline-hidden',
            // Invalid state
            'data-invalid:border-red-500 data-invalid:data-hover:border-red-500 dark:data-invalid:border-red-500 dark:data-invalid:data-hover:border-red-500',
            // Disabled state
            'data-disabled:border-midnight/20 dark:data-disabled:border-white/15 dark:data-disabled:bg-white/[2.5%] dark:data-hover:data-disabled:border-white/15',
          ])}
        />
      </span>
    )
  },
)

Input.displayName = 'Input'
