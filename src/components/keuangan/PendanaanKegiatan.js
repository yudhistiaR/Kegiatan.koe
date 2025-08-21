'use client'

import { useQuery } from '@tanstack/react-query'
import { LoadingState, ErrorState } from '../LoadState/LoadStatus'
import { useAuth } from '@clerk/nextjs'
import { FundingCard } from './PendanaanCard'

const PendanaanKegiatanPage = () => {
  const { orgId } = useAuth()

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['pendanaan', orgId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/organisasi/${orgId}/keuangan/pendanaan`)

      if (!res.ok) {
        throw new Error('Failed to fetch pendanaan data')
      }

      return res.json()
    }
  })

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return <ErrorState error={error} />
  }

  return (
    <div className="w-full h-full mb-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Atur Pendanaan Kegiatan</h1>
          <p className="text-md text-gray-300">
            Kelola dan pantau pendanaan untuk semua kegiatan organisasi
          </p>
        </div>
        {data.map(proker => (
          <FundingCard key={proker.id} data={proker} />
        ))}
      </div>
    </div>
  )
}

export default PendanaanKegiatanPage
