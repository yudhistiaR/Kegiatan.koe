'use client'

import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { formatDate } from '@/helpers/formatedate'
import DataTable from '@/components/ui/DataTable'

const LaporanDaftarProker = () => {
  const { orgId } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['laporan-daftar-proker', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/proker/${orgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch proker data')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  const columns = useMemo(
    () => [
      {
        header: 'No',
        cell: ({ row }) => row.index + 1,
        size: 50
      },
      {
        accessorKey: 'title',
        header: 'Nama Program Kerja'
      },
      {
        accessorKey: 'author',
        header: 'Penanggung Jawab / Author'
      },
      {
        accessorKey: 'description',
        header: 'Deskripsi Singkat'
      },
      {
        accessorKey: 'start',
        header: 'Tanggal Mulai',
        cell: ({ getValue }) => formatDate(getValue())
      },
      {
        accessorKey: 'end',
        header: 'Tanggal Selesai',
        cell: ({ getValue }) => (getValue() ? formatDate(getValue()) : '-')
      }
    ],
    []
  )

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Laporan Daftar Program Kerja</h2>
      {data && data.length > 0 ? (
        <DataTable data={data} columns={columns} isLoading={isLoading} />
      ) : (
        <p className="text-center text-muted-foreground">
          Tidak ada data program kerja.
        </p>
      )}
    </div>
  )
}

export default LaporanDaftarProker
