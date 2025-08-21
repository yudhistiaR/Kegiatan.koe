'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { FundingDetailHeader } from '@/components/keuangan/detailkeuangan/detailHeader'
import { FundingOverviewCards } from '@/components/keuangan/detailkeuangan/detailOverviewCard'
import { FundingSourcesTable } from '@/components/keuangan/detailkeuangan/detailPendanaanTable'
import { RABBreakdownTable } from '@/components/keuangan/detailkeuangan/rabBreakDown'
import { Button } from '@/components/ui/button'
import { LoadingState, ErrorState } from '@/components/LoadState/LoadStatus'
import { ArrowLeft } from 'lucide-react'

export default function FundingDetailPage() {
  const { prokerId } = useParams()

  const router = useRouter()

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['detail-pendanaan', prokerId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/${prokerId}/detail/pendanaan`)
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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-[#2d3154]"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar
          </Button>
        </div>
        {!isFetching && (
          <>
            {/* Program Header */}
            <FundingDetailHeader data={data} />

            {/* Overview Cards */}
            <div className="mt-8">
              <FundingOverviewCards data={data} />
            </div>

            {/* Content Sections */}
            <div className="mt-8 space-y-8">
              {/* RAB Breakdown */}
              <RABBreakdownTable data={data} />

              {/* Funding Sources */}
              <FundingSourcesTable data={data} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
