import { cn } from '@/lib/utils'

type HeadingProps = React.ComponentPropsWithoutRef<
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

export const Heading = ({ className, level = 1, ...props }: HeadingProps) => {
  const Element: `h${typeof level}` = `h${level}`

  return (
    <Element
      {...props}
      className={cn(
        'text-midnight text-2xl/8 font-semibold sm:text-xl/8 dark:text-white',
        className,
      )}
    />
  )
}

export const Subheading = ({
  className,
  level = 2,
  ...props
}: HeadingProps) => {
  const Element: `h${typeof level}` = `h${level}`

  return (
    <Element
      {...props}
      className={cn(
        'text-midnight text-base/7 font-semibold sm:text-sm/6 dark:text-white',
        className,
      )}
    />
  )
}
