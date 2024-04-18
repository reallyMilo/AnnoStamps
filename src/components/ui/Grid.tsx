import { cn } from '@/lib/utils'

type GridProps = {
  children: React.ReactNode
  className?: string
}
const Grid = ({ children, className }: GridProps) => {
  return (
    <div
      className={cn(
        'grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  )
}
export default Grid
