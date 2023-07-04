const Grid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  )
}
export default Grid
