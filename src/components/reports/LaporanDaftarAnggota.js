'use client'

import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import DataTable from '@/components/ui/DataTable'

const LaporanDaftarAnggota = () => {
  const { orgId } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['laporan-daftar-anggota', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/anggota/${orgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch anggota data')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  const columns = useMemo(
    () => [
      {
        accessorKey: 'user.firstName',
        header: 'Nama Lengkap',
        cell: ({ row }) =>
          `${row.original.user.firstName || ''} ${row.original.user.lastName || ''}`.trim()
      },
      {
        accessorKey: 'user.npm',
        header: 'NPM / Nomor Induk'
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
        header: 'Jabatan dalam Organisasi'
      }
    ],
    []
  )

  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Laporan Daftar Anggota Organisasi</h2>
      {data && data.length > 0 ? (
        <DataTable data={data} columns={columns} isLoading={isLoading} />
      ) : (
        <p className="text-center text-muted-foreground">
          Tidak ada data anggota organisasi.
        </p>
      )}
    </div>
  )
}

export default LaporanDaftarAnggota
