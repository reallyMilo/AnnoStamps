import { cn } from '@/lib/utils'

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn('container mx-auto max-w-7xl px-5 py-12', className)}>
      {children}
    </div>
  )
}
