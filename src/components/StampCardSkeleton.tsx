export const StampCardSkeleton = () => {
  return (
    <div className="group relative flex animate-pulse flex-col rounded-lg bg-white shadow-md dark:bg-zinc-800">
      <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-200 group-hover:opacity-75 "></div>

      <div className="flex h-full min-h-[200px] flex-col gap-y-2 px-3 py-2">
        <div className="flex items-baseline justify-between"></div>
        <div className="line-clamp-2 w-full flex-grow overflow-hidden text-ellipsis"></div>

        <span className="h-11"></span>

        <div className="mt-auto flex justify-between"></div>
      </div>
    </div>
  )
}
