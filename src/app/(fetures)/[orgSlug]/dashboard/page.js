'use client'
import { useAuth } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import { BriefcaseBusiness, User, CircleCheckBig, SquareX } from 'lucide-react'
import { LoadingState, ErrorState } from '@/components/LoadState/LoadStatus'
import Image from 'next/image'

const DashboardPage = () => {
  const { orgId, isLoaded } = useAuth()

  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ['statistik', orgId],
    queryFn: async () => {
      const req = await fetch(`/api/v1/organisasi/${orgId}/statistics`)
      return req.json()
    },
    enabled: isLoaded
  })

  if (isPending || isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <div className="w-full max-h-screen space-y-5 flex flex-col">
      {/* List Counter */}
      <h1 className="text-3xl font-md font-semibold">Informasi Organisasi</h1>
      <div className="grid grid-cols-4 grid-rows-1 gap-4">
        <CounterCard
          icon={<BriefcaseBusiness />}
          counter={data.proker}
          title="Total Program Kerja"
          colors="bg-blue-100 text-blue-600"
        />
        <CounterCard
          counter={data.anggota}
          icon={<User />}
          title="Total Anggota"
          colors="bg-orange-100 text-orange-600"
        />
        <CounterCard
          icon={<CircleCheckBig />}
          counter={data.tugasSelesai}
          title="Total Tugas Selesai"
          colors="bg-green-100 text-green-600"
        />
        <CounterCard
          icon={<SquareX />}
          counter={data.tugasTidakSelesai}
          title="Total Tugas Tidak Selesai"
          colors="bg-red-100 text-red-600"
        />
      </div>
      {/* List Kegiatan Terbaru */}
      <div className="h-full min-h-full flex gap-4 flex-3">
        <div className="flex-4 border rounded-md p-4 flex flex-col gap-4">
          <h1 className="text-md font-semibold">Informasi Tugas</h1>
          <ul className="flex-1 overflow-y-auto h-[calc(100% - 80px)]">
            {Array.from({ length: 0 }).map((_, i) => (
              <li key={i}>Data {i}</li>
            ))}
          </ul>
          <p className="text-sm text-zinc-500 italic">
            *List tugas terbaru yang sudah diselesaikan
          </p>
        </div>
        {/* List Ranking Anggora */}
        <div className="h-full min-h-full flex gap-4 flex-2">
          <div className="flex-1 border rounded-lg p-4 flex flex-col gap-4 bg-gradient-to-br">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <h1 className="text-xl font-bold">🏆 Si Rajin</h1>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[350px] pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              <div className="space-y-3">
                {data.topfiveMember.map((item, index) => (
                  <div
                    key={item.user.id}
                    className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                      item.rank === 1
                        ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-l-4 border-yellow-500'
                        : item.rank === 2
                          ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-l-4 border-gray-500'
                          : item.rank === 3
                            ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-l-4 border-orange-600'
                            : 'bg-white border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8">
                        {item.rank < 3 ? (
                          <Image
                            src={
                              item.rank === 1
                                ? '/medal/gold.png'
                                : item.rank === 2
                                  ? '/medal/silver.png'
                                  : '/medal/bronze.png'
                            }
                            width={28}
                            height={28}
                            alt="medal"
                            className="drop-shadow-sm"
                          />
                        ) : (
                          <span className="text-lg font-bold text-slate-600">
                            #{item.rank}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.user.username}
                        </p>
                        <p className="text-xs text-slate-500">
                          {index < 3 ? 'Terajin' : 'Rajin'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-slate-800">
                          {item.tugasSelesai * 1000}
                        </span>
                        <span className="text-xs text-slate-500">pts</span>
                      </div>
                      {index < 3 && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-green-600 font-medium">
                            Top 3
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200">
              <p className="text-sm text-slate-500 italic flex items-center gap-1">
                <span className="text-blue-500">ℹ️</span>
                Anggota dengan penyelesaian tugas terbanyak
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CounterCard = ({ icon, counter, title, colors }) => {
  if (!icon && !counter && !title && !colors) {
    throw new Error('CounterCard requires icons, counter, and title props')
  }

  return (
    <div className="w-full flex items-center justify-center gap-4 border py-4 rounded-md">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-sm ${colors}`}>{icon}</div>
      </div>
      <div>
        <p className="text-4xl font-bold">{counter}</p>
        <p className="font-semibold">{title}</p>
      </div>
    </div>
  )
}

export default DashboardPage
