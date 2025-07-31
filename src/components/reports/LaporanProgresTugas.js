'use client'

import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { formatDate } from '@/helpers/formatedate'
import DataTable from '@/components/ui/DataTable'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const LaporanProgresTugas = () => {
  const { orgId } = useAuth()
  const [selectedProkerFilter, setSelectedProkerFilter] = useState('all')

  const {
    data: tugasData,
    isLoading: isLoadingTugas,
    error: errorTugas
  } = useQuery({
    queryKey: ['laporan-progres-tugas', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/tugas/${orgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tugas data')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  const { data: prokerList, isLoading: isLoadingProker } = useQuery({
    queryKey: ['proker-list-for-tugas-filter', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/proker/${orgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch proker list')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  const groupedData = useMemo(() => {
    if (!tugasData) return {}

    const grouped = tugasData.reduce((acc, item) => {
      const prokerTitle = item.proker?.title || 'Tanpa Program Kerja'
      if (!acc[prokerTitle]) {
        acc[prokerTitle] = []
      }
      acc[prokerTitle].push(item)
      return acc
    }, {})

    if (selectedProkerFilter === 'all') {
      return grouped
    } else {
      return { [selectedProkerFilter]: grouped[selectedProkerFilter] || [] }
    }
  }, [tugasData, selectedProkerFilter])

  const allProkerTitles = useMemo(() => {
    const titles = prokerList?.map(p => p.title) || []
    return ['all', ...new Set(titles)]
  }, [prokerList])

  const handleProkerFilterChange = value => {
    setSelectedProkerFilter(value)
  }

  const columns = useMemo(
    () => [
      {
        header: 'No',
        cell: ({ row }) => row.index + 1,
        size: 50
      },
      {
        accessorKey: 'name',
        header: 'Nama Tugas'
      },
      {
        accessorKey: 'divisi.name',
        header: 'Divisi Penanggung Jawab'
      },
      {
        accessorKey: 'status',
        header: 'Status'
      },
      {
        accessorKey: 'priority',
        header: 'Prioritas'
      },
      {
        accessorKey: 'assignedTo',
        header: 'Ditugaskan Kepada',
        cell: ({ row }) =>
          row.original.assignedTo
            .map(
              assignee => `${assignee.user.firstName} ${assignee.user.lastName}`
            )
            .join(', ')
      },
      {
        accessorKey: 'end',
        header: 'Batas Waktu',
        cell: ({ getValue }) => formatDate(getValue())
      }
    ],
    []
  )
  if (errorTugas) return <p>Error: {errorTugas.message}</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        Laporan Progres Tugas per Program Kerja
      </h2>
      <div className="flex items-center gap-4">
        <span className="text-white">Filter berdasarkan Program Kerja:</span>
        <Select
          onValueChange={handleProkerFilterChange}
          defaultValue={selectedProkerFilter}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Pilih Program Kerja" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Program Kerja</SelectItem>
            {allProkerTitles
              .filter(title => title !== 'all')
              .map(title => (
                <SelectItem key={title} value={title}>
                  {title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      {Object.entries(groupedData).map(([prokerTitle, items]) => (
        <div
          key={prokerTitle}
          className="rounded-lg overflow-hidden border border-border py-4"
        >
          <h3 className="text-lg font-semibold p-4 border-b border-border">
            {prokerTitle}
          </h3>
          <DataTable
            data={items}
            columns={columns}
            isLoading={isLoadingTugas && isLoadingProker}
            enableGlobalFilter={false} // Disable global filter for sub-tables
          />
        </div>
      ))}
    </div>
  )
}

export default LaporanProgresTugas
