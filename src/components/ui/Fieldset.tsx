import type React from 'react'

import * as Headless from '@headlessui/react'

import { cn } from '@/lib/utils'

export const Fieldset = ({
  className,
  ...props
}: Omit<Headless.FieldsetProps, 'className'> & { className?: string }) => {
  return (
    <Headless.Fieldset
      {...props}
      className={cn(
        '*:data-[slot=text]:mt-1 [&>*+[data-slot=control]]:mt-6',
        className,
      )}
    />
  )
}

export const Legend = ({
  className,
  ...props
}: Omit<Headless.LegendProps, 'className'> & { className?: string }) => {
  return (
    <Headless.Legend
      data-slot="legend"
      {...props}
      className={cn(
        'text-midnight text-base/6 font-semibold data-disabled:opacity-50 sm:text-sm/6 dark:text-white',
        className,
      )}
    />
  )
}

export const FieldGroup = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      data-slot="control"
      {...props}
      className={cn('space-y-8', className)}
    />
  )
}

export const Field = ({
  className,
  ...props
}: Omit<Headless.FieldProps, 'className'> & { className?: string }) => {
  return (
    <Headless.Field
      {...props}
      className={cn(
        '[&>[data-slot=label]+[data-slot=control]]:mt-3',
        '[&>[data-slot=label]+[data-slot=description]]:mt-1',
        '[&>[data-slot=description]+[data-slot=control]]:mt-3',
        '[&>[data-slot=control]+[data-slot=description]]:mt-3',
        '[&>[data-slot=control]+[data-slot=error]]:mt-3',
        '*:data-[slot=label]:font-medium',
        className,
      )}
    />
  )
}

export const Label = ({
  className,
  ...props
}: Omit<Headless.LabelProps, 'className'> & { className?: string }) => {
  return (
    <Headless.Label
      data-slot="label"
      {...props}
      className={cn(
        'text-midnight text-base/6 select-none data-disabled:opacity-50 dark:text-white',
        className,
      )}
    />
  )
}

export const Description = ({
  className,
  ...props
}: Omit<Headless.DescriptionProps, 'className'> & { className?: string }) => {
  return (
    <Headless.Description
      data-slot="description"
      {...props}
      className={cn(
        'text-base/6 text-zinc-500 data-disabled:opacity-50 sm:text-sm/6 dark:text-zinc-400',
        className,
      )}
    />
  )
}

export const ErrorMessage = ({
  className,
  ...props
}: Omit<Headless.DescriptionProps, 'className'> & { className?: string }) => {
  return (
    <Headless.Description
      data-slot="error"
      {...props}
      className={cn(
        'text-accent dark:text-accent text-base/6 data-disabled:opacity-50 sm:text-sm/6',
        className,
      )}
    />
  )
}
