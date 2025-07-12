'use client'

const ProkerHeaderSekeleton = () => {
  return (
    <div className="py-2 animate-pulse space-y-2">
      <div>
        <div className="h-6 w-3/4 bg-zinc-300 rounded" />
        <div className="mt-2 h-4 w-1/3 bg-zinc-200 rounded" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-4 w-full bg-zinc-200 rounded" />
        <div className="h-4 w-11/12 bg-zinc-200 rounded" />
        <div className="h-4 w-10/12 bg-zinc-200 rounded" />
      </div>
    </div>
  )
}

export default ProkerHeaderSekeleton
