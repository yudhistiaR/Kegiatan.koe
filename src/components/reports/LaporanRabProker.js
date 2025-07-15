'use client'

import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import DataTable from '@/components/ui/DataTable'

const LaporanRabProker = () => {
  const { orgId } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['laporan-rab-proker', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/rab/${orgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch RAB data')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  const groupedData = useMemo(() => {
    if (!data) return {}

    const grouped = data.reduce((acc, item) => {
      const prokerTitle = item.proker?.title || 'Tanpa Program Kerja'
      if (!acc[prokerTitle]) {
        acc[prokerTitle] = {
          items: [],
          totalAnggaran: 0
        }
      }
      const totalHargaItem = parseFloat(item.harga) * parseFloat(item.jumlah)
      acc[prokerTitle].items.push({
        ...item,
        totalHargaItem: totalHargaItem
      })
      acc[prokerTitle].totalAnggaran += totalHargaItem
      return acc
    }, {})

    return grouped
  }, [data])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nama',
        header: 'Nama Barang/Jasa'
      },
      {
        accessorKey: 'jumlah',
        header: 'Jumlah'
      },
      {
        accessorKey: 'satuan',
        header: 'Satuan'
      },
      {
        accessorKey: 'harga',
        header: 'Harga Satuan',
        cell: ({ getValue }) =>
          `Rp ${parseFloat(getValue()).toLocaleString('id-ID')}`
      },
      {
        accessorKey: 'totalHargaItem',
        header: 'Total Harga',
        cell: ({ getValue }) =>
          `Rp ${parseFloat(getValue()).toLocaleString('id-ID')}`
      }
    ],
    []
  )

  if (isLoading || isLoadingProker) return <p>Loading...</p>
  if (errorRab) return <p>Error: {errorRab.message}</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        Laporan Anggaran (RAB) per Program Kerja
      </h2>
      {Object.entries(groupedData).length > 0 ? (
        Object.entries(groupedData).map(([prokerTitle, prokerData]) => (
          <div
            key={prokerTitle}
            className="rounded-lg overflow-hidden border border-border mb-8"
          >
            <h3 className="text-lg font-semibold p-4 bg-muted/50 border-b border-border">
              {prokerTitle}
            </h3>
            <DataTable
              data={prokerData.items}
              columns={columns}
              isLoading={isLoading}
              enableGlobalFilter={false}
            />
            <div className="p-4 bg-muted/50 border-t border-border text-right font-bold">
              Total Anggaran Proker: Rp{' '}
              {prokerData.totalAnggaran.toLocaleString('id-ID')}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-muted-foreground">Tidak ada data RAB.</p>
      )}
    </div>
  )
}

export default LaporanRabProker
