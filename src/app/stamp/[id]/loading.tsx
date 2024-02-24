import Container from '@/components/ui/Container'

const Loading = () => {
  return (
    <Container className="max-w-5xl animate-pulse space-y-6 px-0">
      <div className="h-[768px] w-full border bg-slate-300 shadow" />
      <h1 className=" truncate text-2xl text-slate-300">Loading...</h1>
      <div className="flex h-10 w-full space-x-5 border bg-slate-300 shadow" />
      <p className="col-span-3 h-7 w-full break-words border  bg-slate-300 text-lg shadow"></p>
    </Container>
  )
}

export default Loading
