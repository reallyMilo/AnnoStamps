import * as Headless from '@headlessui/react'
import type React from 'react'

import { cn } from '@/lib/utils'

export const Fieldset = ({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldsetProps, 'className'>) => {
  return (
    <Headless.Fieldset
      {...props}
      className={cn(
        '[&>*+[data-slot=control]]:mt-6 [&>[data-slot=text]]:mt-1',
        className
      )}
    />
  )
}

export const Legend = ({
  className,
  ...props
}: { className?: string } & Omit<Headless.LegendProps, 'className'>) => {
  return (
    <Headless.Legend
      data-slot="legend"
      {...props}
      className={cn(
        'text-base/6 font-semibold text-midnight data-[disabled]:opacity-50 sm:text-sm/6 dark:text-white',
        className
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
}: { className?: string } & Omit<Headless.FieldProps, 'className'>) => {
  return (
    <Headless.Field
      {...props}
      className={cn(
        '[&>[data-slot=label]+[data-slot=control]]:mt-3',
        '[&>[data-slot=label]+[data-slot=description]]:mt-1',
        '[&>[data-slot=description]+[data-slot=control]]:mt-3',
        '[&>[data-slot=control]+[data-slot=description]]:mt-3',
        '[&>[data-slot=control]+[data-slot=error]]:mt-3',
        '[&>[data-slot=label]]:font-medium',
        className
      )}
    />
  )
}

export const Label = ({
  className,
  ...props
}: { className?: string } & Omit<Headless.LabelProps, 'className'>) => {
  return (
    <Headless.Label
      data-slot="label"
      {...props}
      className={cn(
        'select-none text-base/6 text-midnight data-[disabled]:opacity-50 sm:text-sm/6 dark:text-white',
        className
      )}
    />
  )
}

export const Description = ({
  className,
  ...props
}: { className?: string } & Omit<Headless.DescriptionProps, 'className'>) => {
  return (
    <Headless.Description
      data-slot="description"
      {...props}
      className={cn(
        'text-base/6 text-zinc-500 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-zinc-400',
        className
      )}
    />
  )
}

export const ErrorMessage = ({
  className,
  ...props
}: { className?: string } & Omit<Headless.DescriptionProps, 'className'>) => {
  return (
    <Headless.Description
      data-slot="error"
      {...props}
      className={cn(
        'text-base/6 text-accent data-[disabled]:opacity-50 sm:text-sm/6 dark:text-accent',
        className
      )}
    />
  )
}
