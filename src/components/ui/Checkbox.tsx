import type React from 'react'

import * as Headless from '@headlessui/react'

import { cn } from '@/lib/utils'

export const CheckboxGroup = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      data-slot="control"
      {...props}
      className={cn(
        // Basic groups
        'space-y-3',
        // With descriptions
        'has-data-[slot=description]:space-y-6 has-data-[slot=description]:**:data-[slot=label]:font-medium',
        className,
      )}
    />
  )
}

export const CheckboxField = ({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, 'className'>) => {
  return (
    <Headless.Field
      data-slot="field"
      {...props}
      className={cn(
        // Base layout
        'grid grid-cols-[1.125rem_1fr] items-center gap-x-4 gap-y-1 sm:grid-cols-[1rem_1fr]',
        // Control layout
        '*:data-[slot=control]:col-start-1 *:data-[slot=control]:row-start-1 *:data-[slot=control]:justify-self-center',
        // Label layout
        '*:data-[slot=label]:col-start-2 *:data-[slot=label]:row-start-1 *:data-[slot=label]:justify-self-start',
        // Description layout
        '*:data-[slot=description]:col-start-2 *:data-[slot=description]:row-start-2',
        // With description
        'has-data-[slot=description]:**:data-[slot=label]:font-medium',
        className,
      )}
    />
  )
}

const base = [
  // Basic layout
  'relative isolate flex size-[1.125rem] items-center justify-center rounded-[0.3125rem] sm:size-4',
  // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
  'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(0.3125rem-1px)] before:bg-white before:shadow-sm',
  // Background color when checked
  'group-data-checked:before:bg-(--checkbox-checked-bg)',
  // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
  'dark:before:hidden',
  // Background color applied to control in dark mode
  'dark:bg-white/5 dark:group-data-checked:bg-(--checkbox-checked-bg)',
  // Border
  'border border-zinc-950/15 group-data-checked:border-transparent group-data-hover:group-data-checked:border-transparent group-data-hover:border-zinc-950/30 group-data-checked:bg-(--checkbox-checked-border)',
  'dark:border-white/15 dark:group-data-checked:border-white/5 dark:group-data-hover:group-data-checked:border-white/5 dark:group-data-hover:border-white/30',
  // Inner highlight shadow
  'after:absolute after:inset-0 after:rounded-[calc(0.3125rem-1px)] after:shadow-[inset_0_1px_--theme(--color-white/15%)]',
  'dark:after:-inset-px dark:after:hidden dark:after:rounded-[0.3125rem] dark:group-data-checked:after:block',
  // Focus ring
  'group-data-focus:outline group-data-focus:outline-2 group-data-focus:outline-offset-2 group-data-focus:outline-blue-500',
  // Disabled state
  'group-data-disabled:opacity-50',
  'group-data-disabled:border-zinc-950/25 group-data-disabled:bg-zinc-950/5 group-data-disabled:[--checkbox-check:var(--color-zinc-950)]/50 group-data-disabled:before:bg-transparent',
  'dark:group-data-disabled:border-white/20 dark:group-data-disabled:bg-white/[2.5%] dark:group-data-disabled:[--checkbox-check:var(--color-white)]/50 dark:group-data-checked:group-data-disabled:after:hidden',
  // Forced colors mode
  'forced-colors:[--checkbox-check:HighlightText] forced-colors:[--checkbox-checked-bg:Highlight] forced-colors:group-data-disabled:[--checkbox-check:Highlight]',
  'dark:forced-colors:[--checkbox-check:HighlightText] dark:forced-colors:[--checkbox-checked-bg:Highlight] dark:forced-colors:group-data-disabled:[--checkbox-check:Highlight]',
]

const colors = {
  accent:
    '[--checkbox-check:var(--color-accent)] [--checkbox-checked-bg:var(--color-accent)] [--checkbox-checked-border:var(--color-accent)]/80',
  primary:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-primary)] [--checkbox-checked-border:var(--color-primary)]/90',
  secondary:
    '[--checkbox-check:var(--color-secondary)] [--checkbox-checked-bg:var(--color-secondary)] [--checkbox-checked-border:var(--color-secondary)]/80',
}

type Color = keyof typeof colors

export const Checkbox = ({
  className,
  color = 'primary',
  ...props
}: {
  className?: string
  color?: Color
} & Omit<Headless.CheckboxProps, 'className'>) => {
  return (
    <Headless.Checkbox
      data-slot="control"
      {...props}
      className={cn('group inline-flex focus:outline-hidden', className)}
    >
      <span className={cn([base, colors[color]])}>
        <svg
          className="size-4 stroke-(--checkbox-check) opacity-0 group-data-checked:opacity-100 sm:h-3.5 sm:w-3.5"
          fill="none"
          viewBox="0 0 14 14"
        >
          {/* Checkmark icon */}
          <path
            className="opacity-100 group-data-indeterminate:opacity-0"
            d="M3 8L6 11L11 3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
          {/* Indeterminate icon */}
          <path
            className="opacity-0 group-data-indeterminate:opacity-100"
            d="M3 7H11"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </span>
    </Headless.Checkbox>
  )
}
