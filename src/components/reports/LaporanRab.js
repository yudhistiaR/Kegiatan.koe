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
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

const LaporanRab = ({ onFilterChange }) => {
  const { orgId } = useAuth()
  const [selectedProkerFilter, setSelectedProkerFilter] = useState('all')

  const {
    data: prokerData,
    isLoading: isLoadingProker,
    error: errorProker
  } = useQuery({
    queryKey: ['proker-rab-data', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/proker/${orgId}`)
      if (!response.ok) {
        throw new Error('Gagal mengambil data program kerja')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  const groupedData = useMemo(() => {
    if (!prokerData) return {}

    const result = {}

    const filteredProkerData =
      selectedProkerFilter === 'all'
        ? prokerData
        : prokerData.filter(proker => proker.title === selectedProkerFilter)

    filteredProkerData.forEach(proker => {
      const allRabItems = (proker.rab || []).flatMap(
        rabGroup => rabGroup.listRab || []
      )
      result[proker.title] = allRabItems
    })

    return result
  }, [prokerData, selectedProkerFilter])

  const allProkerTitles = useMemo(() => {
    const titles = prokerData?.map(p => p.title) || []
    return ['all', ...new Set(titles)]
  }, [prokerData])

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
          formatCurrency(
            parseFloat(row.original.harga) * parseFloat(row.original.jumlah)
          )
      }
    ],
    []
  )

  const handleProkerFilterChange = value => {
    setSelectedProkerFilter(value)
    if (onFilterChange) {
      onFilterChange(value)
    }
  }

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(selectedProkerFilter)
    }
  }, [selectedProkerFilter, onFilterChange])

  if (isLoadingProker) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="flex items-center justify-center text-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Memuat data...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (errorProker) {
    return (
      <p className="text-red-500 text-center">Error: {errorProker.message}</p>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span>Filter berdasarkan Program Kerja:</span>
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
          // Hanya render tabel jika ada item RAB untuk program kerja ini
          if (items.length === 0) {
            return null
          }

          const prokerTotal = items.reduce(
            (sum, item) =>
              sum + parseFloat(item.harga) * parseFloat(item.jumlah),
            0
          )
          return (
            <div
              key={prokerTitle}
              className="rounded-lg overflow-hidden border border-gray-200 shadow-md"
            >
              <h3 className="text-xl font-bold p-4 border-b border-gray-200">
                {prokerTitle}
              </h3>
              <DataTable
                data={items}
                columns={columns}
                isLoading={isLoadingProker}
                enableGlobalFilter={false}
              />
              <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold">Total Anggaran Proker:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(prokerTotal)}
                </span>
              </div>
            </div>
          )
        })
      ) : (
        <p className="text-center text-gray-500">
          Tidak ada data RAB untuk program kerja yang dipilih.
        </p>
      )}
    </div>
  )
}

export default LaporanRab
