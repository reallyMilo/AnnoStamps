import { cn } from '@/lib/utils'

interface SelectProps extends React.ComponentPropsWithRef<'select'> {
  children?: React.ReactElement<'option'>
  className?: string
  options?: string[]
  variant?: keyof typeof selectVariantStyles
}

export const selectVariantStyles = {
  primary:
    'w-full bg-[#F0F3F4] truncate rounded-md border py-2.5 pl-4 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-opacity-2',
  primaryShadow:
    'w-full bg-[#F0F3F4] truncate rounded-md border py-2.5 pl-4 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-gray-400 focus:ring-gray-400',
}

const Select = ({
  ref,
  className,
  variant = 'primary',
  children,
  options = [],
  ...props
}: SelectProps) => {
  return (
    <select
      className={cn(selectVariantStyles[variant], className, 'capitalize')}
      ref={ref}
      {...props}
    >
      {children}
      {options.map((option) => (
        <option
          className="capitalize"
          key={`${props.id}-${option}`}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>
  )
}

export default Select
