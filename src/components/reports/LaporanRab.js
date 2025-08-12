'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { formatCurrency } from '@/lib/utils'
import DataTable from '@/components/ui/DataTable'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const LaporanRab = ({ onFilterChange }) => {
  const { orgId } = useAuth()
  const [selectedProkerFilter, setSelectedProkerFilter] = useState('all')

  const {
    data: rabData,
    isLoading: isLoadingRab,
    error: errorRab
  } = useQuery({
    queryKey: ['laporan-rab', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/rab/${orgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch RAB data')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  const { data: prokerList, isLoading: isLoadingProker } = useQuery({
    queryKey: ['proker-list-for-rab-filter', orgId],
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
    if (!rabData) return {}

    const grouped = rabData.reduce((acc, item) => {
      const prokerTitle = item.proker.title
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
  }, [rabData, selectedProkerFilter])

  const columns = useMemo(
    () => [
      {
        header: 'No',
        cell: ({ row }) => row.index + 1,
        size: 50
      },
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
        cell: ({ getValue }) => formatCurrency(getValue())
      },
      {
        id: 'totalHarga',
        header: 'Total Harga',
        cell: ({ row }) =>
          formatCurrency(row.original.harga * row.original.jumlah)
      }
    ],
    []
  )

  const handleProkerFilterChange = value => {
    setSelectedProkerFilter(value)
    // Notify parent component about filter change
    if (onFilterChange) {
      onFilterChange(value)
    }
  }

  const allProkerTitles = useMemo(() => {
    const titles = prokerList?.map(p => p.title) || []
    return ['all', ...new Set(titles)]
  }, [prokerList])

  // Notify parent about initial filter value
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(selectedProkerFilter)
    }
  }, [selectedProkerFilter, onFilterChange])

  if (errorRab) return <p>Error: {errorRab.message}</p>

  return (
    <div className="space-y-6">
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

      {Object.entries(groupedData).length > 0 ? (
        Object.entries(groupedData).map(([prokerTitle, items]) => {
          const prokerTotal = items.reduce(
            (sum, item) => sum + item.harga * item.jumlah,
            0
          )
          return (
            <div
              key={prokerTitle}
              className="rounded-lg overflow-hidden border border-border"
            >
              <h3 className="text-lg font-semibold p-4 border-b border-border">
                {prokerTitle}
              </h3>
              <DataTable
                data={items}
                columns={columns}
                isLoading={isLoadingRab && isLoadingProker}
                enableGlobalFilter={false} // Disable global filter for sub-tables
              />
              <div className="p-4 border-t border-border flex justify-between items-center">
                <span className="font-bold">Total Anggaran Proker:</span>
                <span className="font-bold text-accentColor">
                  {formatCurrency(prokerTotal)}
                </span>
              </div>
            </div>
          )
        })
      ) : (
        <p className="text-center text-muted-foreground">
          Tidak ada data RAB untuk program kerja yang dipilih.
        </p>
      )}
    </div>
  )
}

export default LaporanRab
