import { cn } from '@/lib/utils'

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
} & React.ComponentPropsWithoutRef<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>

export const Heading = ({ className, level = 1, ...props }: HeadingProps) => {
  const Element: `h${typeof level}` = `h${level}`

  return (
    <Element
      {...props}
      className={cn(
        //DARKMODE: dark:text-white
        'text-2xl/8 font-semibold text-midnight sm:text-xl/8 ',
        className
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
        // DARKMODE: dark:text-white
        'text-base/7 font-semibold text-midnight sm:text-sm/6 ',
        className
      )}
    />
  )
}
