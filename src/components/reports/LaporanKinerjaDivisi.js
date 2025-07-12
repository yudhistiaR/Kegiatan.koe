'use client'

import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import DataTable from '@/components/ui/DataTable'

const LaporanKinerjaDivisi = () => {
  const { orgId } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['laporan-kinerja-divisi', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/kinerja-divisi/${orgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch kinerja divisi data')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Nama Divisi'
      },
      {
        accessorKey: 'members',
        header: 'Daftar Anggota Divisi'
      },
      {
        accessorKey: 'completedTasks',
        header: 'Jumlah Tugas Selesai'
      },
      {
        accessorKey: 'pendingTasks',
        header: 'Jumlah Tugas Belum Selesai'
      },
      {
        accessorKey: 'rabUsed',
        header: 'Anggaran yang Digunakan',
        cell: ({ getValue }) => `Rp ${parseFloat(getValue()).toLocaleString('id-ID')}`
      }
    ],
    []
  )

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Laporan Kinerja Divisi</h2>
      {data && data.length > 0 ? (
        <DataTable data={data} columns={columns} isLoading={isLoading} />
      ) : (
        <p className="text-center text-muted-foreground">Tidak ada data kinerja divisi.</p>
      )}
    </div>
  )
}

export default LaporanKinerjaDivisi
