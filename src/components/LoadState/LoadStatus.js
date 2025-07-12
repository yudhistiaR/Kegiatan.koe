import { Loader2 } from 'lucide-react'

export const LoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-3">
        <Loader2 className="animate-spin" size={25} />
        <span>Loading data...</span>
      </div>
    </div>
  )
}

export const NotDataState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className=" text-lg font-medium">No data found</div>
        <div className=" text-sm mt-1">
          Data tidak ditemukan atau belum ada data
        </div>
      </div>
    </div>
  )
}

export const ErrorState = ({ error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-lg font-medium mb-2">
          Error loading data
        </div>
        <div>{error.message}</div>
      </div>
    </div>
  )
}
