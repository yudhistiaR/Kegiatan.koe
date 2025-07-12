'use client'

import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import DataTable from '@/components/ui/DataTable'
import { formatDate } from '@/helpers/formatedate'

const LaporanProker = () => {
  const { orgId } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['laporan-proker', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/proker/${orgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Nama Program Kerja'
      },
      {
        accessorKey: 'author',
        header: 'Penanggung Jawab'
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
        cell: ({ getValue }) => formatDate(getValue())
      }
    ],
    []
  )

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      error={error}
    />
  )
}

export default LaporanProker
