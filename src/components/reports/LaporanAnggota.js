'use client'

import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import DataTable from '@/components/ui/DataTable'

const LaporanAnggota = () => {
  const { orgId } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['laporan-anggota', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/anggota/${orgId}`)
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
        header: 'No',
        cell: ({ row }) => row.index + 1,
        size: 50
      },
      {
        accessorKey: 'user.firstName',
        header: 'Nama Lengkap',
        cell: ({ row }) => {
          const firstName = row.original.user.firstName || ''
          const lastName = row.original.user.lastName || ''
          return `${firstName} ${lastName}`.trim()
        }
      },
      {
        accessorKey: 'user.npm',
        header: 'NPM/NIM'
      },
      {
        accessorKey: 'user.email',
        header: 'Email'
      },
      {
        accessorKey: 'user.telpon',
        header: 'Nomor Telepon'
      },
      {
        accessorKey: 'role',
        header: 'Jabatan'
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

export default LaporanAnggota
