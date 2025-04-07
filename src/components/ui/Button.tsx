import * as Headless from '@headlessui/react'
import React from 'react'

import { cn } from '@/lib/utils'

import { Link } from './Link'

export const styles = {
  base: [
    // Base
    'relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border text-base/6 font-semibold',
    // Sizing
    'px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6',
    // Focus
    'focus:outline-hidden data-focus:outline data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500',
    // Disabled
    'data-disabled:opacity-50',
    // Icon
    '*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-(--btn-icon) sm:*:data-[slot=icon]:my-1 sm:*:data-[slot=icon]:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText]',
  ],
  colors: {
    accent: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-accent)] [--btn-border:var(--color-accent)]/90',
      '[--btn-icon:var(--color-white)] data-active:[--btn-icon:var(--color-midnight)] data-hover:[--btn-icon:var(--color-midnight)]',
    ],
    primary: [
      'text-midnight [--btn-hover-overlay:var(--color-white)]/15 [--btn-bg:var(--color-primary)] [--btn-border:var(--color-primary)]/90',
      '[--btn-icon:var(--color-midnight)] data-active:[--btn-icon:var(--color-midnight)] data-hover:[--btn-icon:var(--color-midnight)]/90',
    ],
    secondary: [
      'text-midnight [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-secondary)] [--btn-border:var(--color-secondary)]/90',
      '[--btn-icon:var(--color-midnight)] data-active:[--btn-icon:var(--color-midnight)] data-hover:[--btn-icon:var(--color-midnight)]/90',
    ],
  },
  outline: [
    // Base
    'border-midnight/10 text-midnight data-active:bg-midnight/[2.5%] data-hover:bg-midnight/[2.5%]',
    // Dark mode
    'dark:border-white/15 dark:text-white dark:[--btn-bg:transparent] dark:data-active:bg-white/5 dark:data-hover:bg-white/5',
    // Icon
    '[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]',
  ],
  plain: [
    // Base
    'border-transparent text-midnight data-active:bg-midnight/5 data-hover:bg-midnight/5',
    // Dark mode
    'dark:text-white dark:data-active:bg-white/10 dark:data-hover:bg-white/10',
    // Icon
    '[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:[--btn-icon:var(--color-zinc-500)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]',
  ],
  solid: [
    // Optical border, implemented as the button background to avoid corner artifacts
    'border-transparent bg-(--btn-border)',
    // Dark mode: border is rendered on `after` so background is set to button background
    'dark:bg-(--btn-bg)',
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg)',
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    'before:shadow-sm',
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    'dark:before:hidden',
    // Dark mode: Subtle white outline is applied using a border
    'dark:border-white/5',
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)]',
    // Inner highlight shadow
    'after:shadow-[shadow:inset_0_1px_--theme(--color-white/15%)]',
    // White overlay on hover
    'data-active:after:bg-(--btn-hover-overlay) data-hover:after:bg-(--btn-hover-overlay)',
    // Dark mode: `after` layer expands to cover entire button
    'dark:after:-inset-px dark:after:rounded-lg',
    // Disabled
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
}

type ButtonProps = { children: React.ReactNode; className?: string } & (
  | { color?: keyof typeof styles.colors; outline?: never; plain?: never }
  | { color?: never; outline: true; plain?: never }
  | { color?: never; outline?: never; plain: true }
) &
  (
    | Omit<Headless.ButtonProps, 'className'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
  )

export const Button = React.forwardRef(
  (
    { children, className, color, outline, plain, ...props }: ButtonProps,
    ref: React.ForwardedRef<HTMLElement>,
  ) => {
    const classes = cn(
      styles.base,
      outline
        ? styles.outline
        : plain
          ? styles.plain
          : cn(styles.solid, styles.colors[color ?? 'primary']),
      className,
    )

    return 'href' in props ? (
      <Link
        {...props}
        className={classes}
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
      >
        <TouchTarget>{children}</TouchTarget>
      </Link>
    ) : (
      <Headless.Button
        {...props}
        className={cn('cursor-default', classes)}
        ref={ref}
      >
        <TouchTarget>{children}</TouchTarget>
      </Headless.Button>
    )
  },
)
Button.displayName = 'Button'
/* Expand the hit area to at least 44×44px on touch devices */
export const TouchTarget = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
      />
      {children}
    </>
  )
}
