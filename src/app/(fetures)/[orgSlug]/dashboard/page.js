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
    <div className="w-full max-h-screen space-y-5 flex flex-col text-white min-h-screen">
      <h1 className="text-3xl font-semibold text-white">
        Informasi Organisasi
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <CounterCard
          icon={<BriefcaseBusiness />}
          counter={data.proker}
          title="Total Program Kerja"
          colors="bg-[oklch(56.95%_0.165_266.79)] text-white"
        />
        <CounterCard
          counter={data.anggota}
          icon={<User />}
          title="Total Anggota"
          colors="bg-[oklch(56.95%_0.165_266.79)] text-white"
        />
        <CounterCard
          icon={<CircleCheckBig />}
          counter={data.tugasSelesai}
          title="Total Tugas Selesai"
          colors="bg-green-600 text-white"
        />
        <CounterCard
          icon={<SquareX />}
          counter={data.tugasTidakSelesai}
          title="Total Tugas Tidak Selesai"
          colors="bg-red-600 text-white"
        />
      </div>

      <div className="h-full min-h-full flex flex-col lg:flex-row gap-4 flex-3">
        <div className="flex-4 border border-[oklch(27.27%_0.056_276.3)] rounded-lg shadow-sm flex flex-col gap-4 bg-[oklch(27.27%_0.056_276.3)]">
          <h1 className="text-lg font-semibold text-white">Informasi Tugas</h1>
          <div className="overflow-hidden">
            <div className="overflow-y-auto max-h-[400px]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[oklch(56.95%_0.165_266.79)] bg-opacity-20">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-md text-white">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                      Nama Tugas
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-white">
                      Prioritas
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider rounded-tr-md text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[oklch(56.95%_0.165_266.79)] divide-opacity-30">
                  {data.infoTugasSelesai.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[oklch(56.95%_0.165_266.79)] hover:bg-opacity-10 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="font-medium text-white">
                          {item.name}
                        </div>
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
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-white">
                            {item.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[oklch(56.95%_0.165_266.79)] border-opacity-30">
            <p className="text-sm text-gray-300 italic flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              List tugas terbaru yang sudah diselesaikan
            </p>
          </div>
        </div>

        <div className="h-full min-h-full flex gap-4 flex-2">
          <div className="flex-1 border border-[oklch(27.27%_0.056_276.3)] rounded-lg p-4 flex flex-col gap-4 bg-[oklch(27.27%_0.056_276.3)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[oklch(56.95%_0.165_266.79)] rounded-full animate-pulse"></div>
              <h1 className="text-xl font-bold text-white">🏆 Si Rajin</h1>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[350px] pr-2 scrollbar-thin scrollbar-thumb-[oklch(56.95%_0.165_266.79)] scrollbar-track-[oklch(29.46%_0.06_276.82)]">
              <div className="space-y-3">
                {data.topfiveMember.map((item, index) => (
                  <div
                    key={item.user.id}
                    className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                      item.rank === 1
                        ? 'bg-gradient-to-r from-[oklch(56.95%_0.165_266.79)] to-[oklch(56.95%_0.165_266.79)] bg-opacity-80 border-l-4 border-[oklch(56.95%_0.165_266.79)]'
                        : item.rank === 2
                          ? 'bg-gradient-to-r from-[oklch(56.95%_0.165_266.79)] to-[oklch(56.95%_0.165_266.79)] bg-opacity-60 border-l-4 border-[oklch(56.95%_0.165_266.79)]'
                          : item.rank === 3
                            ? 'bg-gradient-to-r from-[oklch(56.95%_0.165_266.79)] to-[oklch(56.95%_0.165_266.79)] bg-opacity-40 border-l-4 border-[oklch(56.95%_0.165_266.79)]'
                            : 'bg-[oklch(29.46%_0.06_276.82)] border border-[oklch(56.95%_0.165_266.79)] border-opacity-30 hover:border-opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8">
                        {item.rank <= 3 ? (
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
                          <span className="text-lg font-bold text-white">
                            #{item.rank}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {item.user.username}
                        </p>
                        <p className="text-xs text-gray-300">
                          {index < 3 ? 'Terajin' : 'Rajin'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-white">
                          {item.tugasSelesai * 1000}
                        </span>
                        <span className="text-xs text-gray-300">pts</span>
                      </div>
                      {index < 3 && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-[oklch(56.95%_0.165_266.79)] rounded-full"></div>
                          <span className="text-xs text-[oklch(56.95%_0.165_266.79)] font-medium">
                            Top 3
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-[oklch(56.95%_0.165_266.79)] border-opacity-30">
              <p className="text-sm text-gray-300 italic flex items-center gap-1">
                <span className="text-[oklch(56.95%_0.165_266.79)]">ℹ️</span>
                Anggota dengan penyelesaian tugas terbanyak
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getPriorityColor = priority => {
  const priorityLower = priority?.toLowerCase() || ''
  switch (priorityLower) {
    case 'tinggi':
    case 'high':
      return 'bg-red-600 text-white border-red-500'
    case 'sedang':
    case 'medium':
      return 'bg-yellow-600 text-white border-yellow-500'
    case 'rendah':
    case 'low':
      return 'bg-green-600 text-white border-green-500'
    default:
      return 'bg-gray-600 text-white border-gray-500'
  }
}

const CounterCard = ({ icon, counter, title, colors }) => {
  if (!icon && !counter && !title && !colors) {
    throw new Error('CounterCard requires icons, counter, and title props')
  }

  return (
    <div className="w-full flex items-center justify-center gap-4 border py-4 rounded-md hover:bg-opacity-80 transition-all">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-sm ${colors}`}>{icon}</div>
      </div>
      <div>
        <p className="text-4xl font-bold text-white">{counter}</p>
        <p className="font-semibold text-gray-200">{title}</p>
      </div>
    </div>
  )
}

export default DashboardPage
