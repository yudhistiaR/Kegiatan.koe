import { BriefcaseBusiness, User, CircleCheckBig, SquareX } from 'lucide-react'

const DashboardPage = () => {
  return (
    <div className="w-full max-h-screen space-y-5 flex flex-col">
      {/* List Counter */}
      <h1 className="text-3xl font-md font-semibold">Informasi Organisasi</h1>
      <div className="grid grid-cols-4 grid-rows-1 gap-4">
        <CounterCard
          icon={<BriefcaseBusiness />}
          counter="100"
          title="Total Program Kerja"
          colors="bg-blue-100 text-blue-600"
        />
        <CounterCard
          counter="3059"
          icon={<User />}
          title="Total Anggota"
          colors="bg-orange-100 text-orange-600"
        />
        <CounterCard
          icon={<CircleCheckBig />}
          counter="359"
          title="Total Tugas Selesai"
          colors="bg-green-100 text-green-600"
        />
        <CounterCard
          icon={<SquareX />}
          counter="359"
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
