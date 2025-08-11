'use client'
import { useAuth } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import {
  BriefcaseBusiness,
  User,
  CircleCheckBig,
  SquareX,
  CheckCircle
} from 'lucide-react'
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
        {/* Improved Task Table */}
        <div className="flex-4 border rounded-lg shadow-sm p-6 flex flex-col gap-4">
          <h1 className="text-lg font-semibold">Informasi Tugas</h1>
          <div className="overflow-hidden">
            <div className="overflow-y-auto max-h-[400px]">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-md">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Nama Tugas
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                      Prioritas
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider rounded-tr-md">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.infoTugasSelesai.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="font-medium">{item.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{item.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-500 italic flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              List tugas terbaru yang sudah diselesaikan
            </p>
          </div>
        </div>

        {/* List Ranking Anggota */}
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
                            alt="medal"
                            height={28}
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

// Helper function untuk warna prioritas
const getPriorityColor = priority => {
  const priorityLower = priority?.toLowerCase() || ''
  switch (priorityLower) {
    case 'tinggi':
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'sedang':
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'rendah':
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
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
