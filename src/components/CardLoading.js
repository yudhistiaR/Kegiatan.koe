export function CardLoading() {
  return (
    <div className="bg-background flex flex-col gap-4 p-4 rounded-sm shadow hover:bg-background/10 transition-colors duration-200 animate-pulse">
      <div>
        <div className="h-4 w-1/2 bg-muted rounded mb-2" />
        <div className="flex items-center gap-2 text-xs mt-2 font-semibold">
          <div className="h-4 w-24 bg-green-300/70 rounded" />
          <div className="h-4 w-28 bg-red-300/70 rounded" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-accentColor rounded-full" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-accentColor rounded-full" />
          <div className="h-4 w-28 bg-muted rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-accentColor rounded-full" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}
