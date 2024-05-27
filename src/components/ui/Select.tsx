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
    ref: React.ForwardedRef<HTMLSelectElement>
  ) => {
    return (
      <span
        data-slot="control"
        className={cn([
          // Basic layout
          'group relative block w-full',
          // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
          'before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow',
          // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
          'dark:before:hidden',
          // Focus ring
          'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent after:has-[[data-focus]]:ring-2 after:has-[[data-focus]]:ring-blue-500',
          // Disabled state
          'has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none',
          className,
        ])}
      >
        <Headless.Select
          ref={ref}
          multiple={multiple}
          {...props}
          className={cn([
            // Basic layout
            'relative block w-full appearance-none rounded-lg py-[calc(theme(spacing[2.5])-1px)] capitalize sm:py-[calc(theme(spacing[1.5])-1px)]',
            // Horizontal padding
            multiple
              ? 'px-[calc(theme(spacing[3.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)]'
              : 'pl-[calc(theme(spacing[3.5])-1px)] pr-[calc(theme(spacing.10)-1px)] sm:pl-[calc(theme(spacing.3)-1px)] sm:pr-[calc(theme(spacing.9)-1px)]',
            // Options (multi-select)
            '[&_optgroup]:font-semibold',
            // Typography
            'text-base/6 text-midnight placeholder:text-zinc-500 sm:text-sm/6 dark:text-white dark:*:text-white',
            // Border
            'border border-midnight/10 data-[hover]:border-midnight/20 dark:border-white/10 dark:data-[hover]:border-white/20',
            // Background color
            'bg-transparent dark:bg-white/5 dark:*:bg-zinc-800',
            // Hide default focus styles
            'focus:outline-none',
            // Invalid state
            'data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-600 data-[invalid]:data-[hover]:dark:border-red-600',
            // Disabled state
            'data-[disabled]:border-midnight/20 data-[disabled]:opacity-100 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]',
          ])}
        />
      </span>
    )
  }
)

Select.displayName = 'Select'
