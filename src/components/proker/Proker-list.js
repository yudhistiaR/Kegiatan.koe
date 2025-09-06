'use client'

//Hooks
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { formatDate } from '@/helpers/formatedate'

//components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { User, Target, Calendar } from 'lucide-react'
import { LoadingState, NotDataState, ErrorState } from '../LoadState/LoadStatus'
import { buttonVariants } from '../ui/button'
import { Eye } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import DeleteProker from './DeleteProker'
import EditProker from './EditProker'

const ProkerList = () => {
  const { userId, orgId, orgSlug, isLoaded } = useAuth()

  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ['proker-list', userId, orgId],
    queryFn: async () => {
      const res = await fetch('/api/v1/proker', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message)
      }
      return res.json()
    },
    enabled: isLoaded && !!userId && !!orgId
  })

  if (isLoading || isPending) {
    return <LoadingState />
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <NotDataState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map(proker => {
        const totalTugas = proker.tugas?.length || 0
        const completedTasks =
          proker.tugas?.filter(task => task.status === 'DONE').length || 0
        const progressPercentage =
          totalTugas > 0 ? Math.round((completedTasks / totalTugas) * 100) : 0

        return (
          <Card
            key={proker.id}
            className="h-full transition-all duration-300 hover:shadow-md border-zinc-500"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold line-clamp-2 flex-1">
                  {proker.title}
                </CardTitle>
                <span>
                  {/* Detail */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        className={`${buttonVariants({ size: 'sm', variant: 'ghost' })}  'text-gray-400 hover:text-white hover:ring ring-accentColor hover:bg-accentColor/20 block'`}
                        href={`/${orgSlug}/proker/${proker.id}`}
                      >
                        <Eye />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Detail</p>
                    </TooltipContent>
                  </Tooltip>
                  {/* Hapus */}
                  <DeleteProker orgId={proker.orgId} prokerId={proker.id} />
                  {/* Edit */}
                  <EditProker
                    orgId={proker.orgId}
                    prokerId={proker.id}
                    datas={proker}
                  />
                </span>
              </div>

              {proker.description && (
                <p className="text-sm line-clamp-2 mt-2">
                  {proker.description}
                </p>
              )}
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-4">
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${progressPercentage}%`,
                      backgroundColor: 'oklch(56.95% 0.165 266.79)'
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs">
                    {completedTasks} dari {totalTugas} tugas selesai
                  </span>
                  <span className="text-xs font-medium">
                    {progressPercentage}%
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User
                    size={16}
                    style={{ color: 'oklch(56.95% 0.165 266.79)' }}
                  />
                  <span className="font-medium">
                    {proker.ketua_pelaksana?.fullName ||
                      'Tidak ada ketua pelaksana'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar
                    size={16}
                    style={{ color: 'oklch(56.95% 0.165 266.79)' }}
                  />
                  <span>Mulai: {formatDate(proker.start)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Target
                    size={16}
                    style={{ color: 'oklch(56.95% 0.165 266.79)' }}
                  />
                  <span>Selesai: {formatDate(proker.end)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default ProkerList
