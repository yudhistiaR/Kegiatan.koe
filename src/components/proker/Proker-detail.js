'use client'

import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'
import {
  User,
  BarChart3,
  CheckSquare,
  FileText,
  Receipt,
  Clock
} from 'lucide-react'
import { converDateTime, formatCurrency } from '@/lib/utils'
import {
  LoadingState,
  NotDataState,
  ErrorState
} from '@/components/LoadState/LoadStatus'

const DetailProker = ({ orgId, prokerId }) => {
  const {
    data: rawData,
    isPending,
    isLoading,
    error
  } = useQuery({
    queryKey: ['proker-detail', orgId, prokerId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/proker/${orgId}/${prokerId}`)
      if (!res.ok) {
        throw new Error('Failed to fetch proker data')
      }
      return res.json()
    },
    enabled: !!orgId && !!prokerId
  })

  const data = rawData?.[0]

  const allRabItems = useMemo(() => {
    return data?.rab?.flatMap(group => group.listRab) || []
  }, [data])

  const columnHelper = createColumnHelper()

  const rabColumns = useMemo(
    () => [
      columnHelper.accessor('nama', {
        header: 'Item',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('harga', {
        header: 'Harga',
        cell: info => formatCurrency(parseFloat(info.getValue()) || 0)
      }),
      columnHelper.accessor('jumlah', {
        header: 'Jumlah',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('satuan', {
        header: 'Satuan',
        cell: info => info.getValue()
      }),
      columnHelper.display({
        id: 'total',
        header: 'Total',
        cell: ({ row }) => {
          const harga = parseFloat(row.original.harga) || 0
          const jumlah = parseFloat(row.original.jumlah) || 1
          return formatCurrency(harga * jumlah)
        }
      })
    ],
    [columnHelper]
  )

  const rabTable = useReactTable({
    data: allRabItems,
    columns: rabColumns,
    getCoreRowModel: getCoreRowModel()
  })

  const divisiColumns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Nama Divisi',
        cell: info => <div className="font-medium">{info.getValue()}</div>
      }),
      columnHelper.accessor('description', {
        header: 'Deskripsi',
        cell: info => <div>{info.getValue()}</div>
      })
    ],
    [columnHelper]
  )

  const divisiTable = useReactTable({
    data: data?.divisi || [],
    columns: divisiColumns,
    getCoreRowModel: getCoreRowModel()
  })

  if (isLoading || isPending) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  if (!data) {
    return <NotDataState />
  }

  const totalDivisi = data.divisi?.length || 0
  const totalTugas = data.tugas?.length || 0
  const totalNotulensi = data.notulensi?.length || 0

  const totalRAB = useMemo(
    () =>
      allRabItems.reduce((sum, item) => {
        const harga = parseFloat(item.harga) || 0
        const jumlah = parseFloat(item.jumlah) || 1
        return sum + harga * jumlah
      }, 0),
    [allRabItems]
  )

  const completedTasks =
    data.tugas?.filter(task => task.status === 'DONE').length || 0
  const progressPercentage =
    totalTugas > 0 ? Math.round((completedTasks / totalTugas) * 100) : 0

  const getProgramStatus = () => {
    if (totalTugas === 0)
      return { label: 'Belum Ada Tugas', color: 'bg-gray-100 text-gray-800' }
    if (progressPercentage === 100)
      return { label: 'Selesai', color: 'bg-green-100 text-green-800' }
    if (progressPercentage >= 50)
      return { label: 'Sedang Berlangsung', color: 'bg-blue-100 text-blue-800' }
    if (progressPercentage > 0)
      return { label: 'Baru Dimulai', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'Belum Dimulai', color: 'bg-gray-100 text-gray-800' }
  }

  const programStatus = getProgramStatus()

  return (
    <div className="min-h-screen pt-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Detail Program Kerja</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg shadow-sm border p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span className="font-medium">Ketua Pelaksana:</span>
                  <span>{data.ketua_pelaksana.fullName}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 ">Deskripsi</h3>
                <p className=" leading-relaxed">{data.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-lg shadow-sm border p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm">Total Divisi</p>
                    <p className="text-2xl font-bold">{totalDivisi}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg shadow-sm border p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckSquare className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm">Total Tugas</p>
                    <p className="text-2xl font-bold">{totalTugas}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg shadow-sm border p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Receipt className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm">Total RAB</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(totalRAB)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg shadow-sm border p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FileText className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm">Total Notulensi</p>
                    <p className="text-2xl font-bold">{totalNotulensi}</p>
                  </div>
                </div>
              </div>
            </div>
            {data.divisi && data.divisi.length > 0 && (
              <div className="rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold mb-4">Divisi</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      {divisiTable.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map(header => (
                            <th
                              key={header.id}
                              className="px-4 py-3 text-left text-sm font-medium border-b"
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {divisiTable.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className="px-4 py-3 text-sm">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {allRabItems.length > 0 && (
              <div className="rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold mb-4">
                  Rencana Anggaran Biaya (RAB)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      {rabTable.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map(header => (
                            <th
                              key={header.id}
                              className="px-4 py-3 text-left text-sm font-medium border-b"
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rabTable.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className="px-4 py-3 text-sm">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total RAB:</span>
                    <span className="text-lg font-bold text-blue-500">
                      {formatCurrency(totalRAB)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock size={20} />
                Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Mulai</p>
                    <p className="text-sm">{converDateTime(data.start)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Berakhir</p>
                    <p className="text-sm">{converDateTime(data.end)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Dibuat</p>
                    <p className="text-sm">{converDateTime(data.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-4">Status Program</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Progress</span>
                  <span className="text-sm font-medium">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-500 rounded-full h-2">
                  <div
                    className="bg-accentColor h-2 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>
                    {completedTasks} dari {totalTugas} tugas selesai
                  </span>
                </div>
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${programStatus.color}`}
                  >
                    {programStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailProker
