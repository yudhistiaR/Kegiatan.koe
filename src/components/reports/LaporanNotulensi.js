'use client'

import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { formatDate } from '@/helpers/formatedate'
import DataTable from '@/components/ui/DataTable'

import DOMPurify from 'dompurify'

const LaporanNotulensi = () => {
  const { orgId } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['laporan-notulensi', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/notulensi/${orgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch notulensi data')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Judul Rapat'
      },
      {
        accessorKey: 'date',
        header: 'Tanggal',
        cell: ({ getValue }) => formatDate(getValue())
      },
      {
        accessorKey: 'time',
        header: 'Waktu',
        cell: ({ getValue }) => {
          const time = getValue();
          if (!time) return '-';
          // Assuming time is stored as a string like "HH:MM:SS"
          // You might need to adjust this based on your actual time format
          return time.substring(0, 5); // Display HH:MM
        }
      },
      {
        accessorKey: 'location',
        header: 'Lokasi'
      },
      {
        accessorKey: 'agenda',
        header: 'Agenda Pembahasan'
      },
      {
        accessorKey: 'content',
        header: 'Isi/Hasil Rapat',
        cell: ({ getValue }) => <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getValue()) }} />
      },
      {
        accessorKey: 'attendees',
        header: 'Daftar Hadir'
      }
    ],
    []
  )

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Laporan Notulensi Rapat</h2>
      {data && data.length > 0 ? (
        <DataTable data={data} columns={columns} isLoading={isLoading} />
      ) : (
        <p className="text-center text-muted-foreground">Tidak ada data notulensi rapat.</p>
      )}
    </div>
  )
}

export default LaporanNotulensi