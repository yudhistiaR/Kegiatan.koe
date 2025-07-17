'use client'
import { useAuth } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import { BriefcaseBusiness, User, CircleCheckBig, SquareX } from 'lucide-react'
import { LoadingState, ErrorState } from '@/components/LoadState/LoadStatus'

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

  if (isPending | isLoading) {
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
          <div className="flex-1 border rounded-md p-4 flex flex-col gap-4">
            <h1 className="text-md font-semibold">Si Rajan</h1>
            <ul className="flex-2 overflow-y-auto h-[calc(100% - 80px)]">
              {Array.from({ length: 0 }).map((_, i) => (
                <li key={i}>Data {i}</li>
              ))}
            </ul>
            <p className="text-sm text-zinc-500 italic">
              *Anggota dengan penyelesaian tugas terbanyak
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const CounterCard = ({ icon, counter, title, colors }) => {
  if (!icon & !counter & !title & !colors) {
    throw new Error('CounterCard requires icons, counte, and title props')
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
