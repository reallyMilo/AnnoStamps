import { cn } from '@/lib/utils'

import { Link } from './Link'

export const Text = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'p'>) => {
  return (
    <p
      data-slot="text"
      {...props}
      className={cn(
        'text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400',
        className
      )}
    />
  )
}

export const TextLink = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link>) => {
  return (
    <Link
      {...props}
      className={cn(
        'text-midnight underline decoration-midnight/50 data-[hover]:decoration-midnight dark:text-white dark:decoration-white/50 dark:data-[hover]:decoration-white',
        className
      )}
    />
  )
}

export const Strong = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'strong'>) => {
  return (
    <strong
      {...props}
      className={cn('font-medium text-midnight dark:text-white', className)}
    />
  )
}
