import * as Headless from '@headlessui/react'
import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

export const Select = forwardRef(
  (
    {
      className,
      multiple,
      ...props
    }: { className?: string } & Omit<Headless.SelectProps, 'className'>,
    ref: React.ForwardedRef<HTMLSelectElement>,
  ) => {
    return (
      <span
        className={cn([
          // Basic layout
          'group relative block w-full',
          // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
          'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm',
          // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
          'dark:before:hidden',
          // Focus ring
          'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset has-data-focus:after:ring-2 has-data-focus:after:ring-blue-500',
          // Disabled state
          'has-data-disabled:opacity-50 has-data-disabled:before:bg-zinc-950/5 has-data-disabled:before:shadow-none',
          className,
        ])}
        data-slot="control"
      >
        <Headless.Select
          multiple={multiple}
          ref={ref}
          {...props}
          className={cn([
            // Basic layout
            'relative block w-full appearance-none rounded-lg py-[calc(--spacing(2.5)-1px)] capitalize sm:py-[calc(--spacing(1.5)-1px)]',
            // Horizontal padding
            multiple
              ? 'px-[calc(--spacing(3.5)-1px)] sm:px-[calc(--spacing(3)-1px)]'
              : 'pr-[calc(--spacing(10)-1px)] pl-[calc(--spacing(3.5)-1px)] sm:pr-[calc(--spacing(9)-1px)] sm:pl-[calc(--spacing(3)-1px)]',
            // Options (multi-select)
            '[&_optgroup]:font-semibold',
            // Typography
            'text-midnight text-base/6 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white dark:*:text-white',
            // Border
            'border-midnight/10 data-hover:border-midnight/20 border dark:border-white/10 dark:data-hover:border-white/20',
            // Background color
            'bg-transparent dark:bg-white/5 dark:*:bg-zinc-800',
            // Hide default focus styles
            'focus:outline-hidden',
            // Invalid state
            'data-invalid:border-red-500 data-invalid:data-hover:border-red-500 dark:data-invalid:border-red-600 dark:data-invalid:data-hover:border-red-600',
            // Disabled state
            'data-disabled:border-midnight/20 data-disabled:opacity-100 dark:data-disabled:border-white/15 dark:data-disabled:bg-white/[2.5%] dark:data-hover:data-disabled:border-white/15',
          ])}
        />
      </span>
    )
  },
)

Select.displayName = 'Select'
