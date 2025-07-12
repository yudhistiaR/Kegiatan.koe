'use client'

import React, { useMemo } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { formatCurrency } from '@/lib/utils'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'
import { LoadingState, NotDataState, ErrorState } from '../LoadState/LoadStatus'

export default function RABTable() {
  const { orgId } = useAuth()
  const { prokerId } = useParams()

  const groupByDivision = data => {
    return data.reduce((acc, item) => {
      const divisionName = item.divisi.name
      if (!acc[divisionName]) {
        acc[divisionName] = {
          divisi: item.divisi,
          items: [],
          total: 0
        }
      }

      const totalHarga = parseInt(item.harga) * parseInt(item.jumlah)
      acc[divisionName].items.push({
        ...item,
        totalHarga
      })
      acc[divisionName].total += totalHarga

      return acc
    }, {})
  }

  const {
    data: rabProker,
    isLoading,
    isPending,
    error
  } = useQuery({
    queryKey: ['rab-proker', orgId, prokerId],
    queryFn: async () => {
      const req = await fetch(`/api/v1/proker/${orgId}/${prokerId}/rab`)
      const response = await req.json()
      return Array.isArray(response) ? response : response.data || []
    },
    select: groupByDivision
  })

  // Pastikan data sudah tersedia sebelum digunakan
  const groupedData = rabProker || {}

  // Hitung grand total dari grouped data
  const grandTotal = useMemo(() => {
    return Object.values(groupedData).reduce(
      (sum, group) => sum + group.total,
      0
    )
  }, [groupedData])

  // Hitung total items dari grouped data
  const totalItems = useMemo(() => {
    return Object.values(groupedData).reduce(
      (sum, group) => sum + group.items.length,
      0
    )
  }, [groupedData])

  // Column helper untuk TanStack Table
  const columnHelper = createColumnHelper()

  // Definisi kolom untuk TanStack Table
  const columns = useMemo(
    () => [
      columnHelper.accessor((row, index) => index + 1, {
        id: 'no',
        header: 'No',
        cell: info => info.getValue(),
        size: 60
      }),
      columnHelper.accessor('nama', {
        header: 'Nama Item',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('harga', {
        header: 'Harga Satuan',
        cell: info => formatCurrency(parseInt(info.getValue()))
      }),
      columnHelper.accessor('jumlah', {
        header: 'Jumlah',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('satuan', {
        header: 'Satuan',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('totalHarga', {
        header: 'Total',
        cell: info => formatCurrency(info.getValue())
      })
    ],
    [columnHelper]
  )

  // Komponen tabel untuk setiap divisi
  const DivisionTable = ({ divisionName, divisionData }) => {
    const table = useReactTable({
      data: divisionData.items,
      columns,
      getCoreRowModel: getCoreRowModel()
    })

    //LoadStatus
    if (isLoading | isPending) {
      return <LoadingState />
    }
    if (error) {
      return <ErrorState error={error} />
    }

    return (
      <div className="rounded-lg shadow-lg border border-gray-200">
        {/* Header Divisi */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-accentColor rounded-full"></div>
              <h3 className="text-lg font-semibold">{divisionName}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-accentColor text-white text-sm font-medium rounded-full">
                {divisionData.items.length} item
                {divisionData.items.length > 1 ? 's' : ''}
              </span>
              <span className="px-3 py-1 text-sm font-medium rounded-full">
                {formatCurrency(divisionData.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Header */}
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="border-b border-gray-200">
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className={`px-6 py-4 text-sm font-semibold ${
                          header.id === 'no'
                            ? 'text-center w-16'
                            : header.id === 'nama'
                              ? 'text-left min-w-[200px]'
                              : header.id === 'harga' ||
                                  header.id === 'totalHarga'
                                ? 'text-right min-w-[120px]'
                                : 'text-center min-w-[100px]'
                        }`}
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

              {/* Body */}
              <tbody className="divide-y divide-gray-100">
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-accentColor transition-colors duration-150`}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className={`px-6 py-4 text-sm ${
                          cell.column.id === 'no'
                            ? 'text-center font-medium'
                            : cell.column.id === 'nama'
                              ? 'text-left font-medium'
                              : cell.column.id === 'harga' ||
                                  cell.column.id === 'totalHarga'
                                ? 'text-right font-medium'
                                : 'text-center'
                        } ${
                          cell.column.id === 'totalHarga'
                            ? 'font-semibold text-blue-500'
                            : ''
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>

              {/* Footer */}
              <tfoot className="border-t-2 border-gray-200">
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-right font-semibold"
                  >
                    Subtotal {divisionName}:
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-lg text-blue-600">
                    {formatCurrency(divisionData.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 min-h-screen">
      {/* Header */}
      <div className=" rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Rencana Anggaran Biaya (RAB)
            </h1>
            <p>Daftar anggaran berdasarkan divisi</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600 mb-1">
              {formatCurrency(grandTotal)}
            </div>
            <p className="text-sm">Total Anggaran</p>
          </div>
        </div>
      </div>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold">
                {Object.keys(groupedData).length}
              </div>
              <p className="text-sm">Total Divisi</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-sm ">Total Item</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold">
                {Math.round(
                  grandTotal / Object.keys(groupedData).length || 0
                ).toLocaleString()}
              </div>
              <p className="text-sm">Rata-rata per Divisi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel untuk setiap divisi */}
      <div className="space-y-6">
        {Object.entries(groupedData).map(([divisionName, divisionData]) => (
          <DivisionTable
            key={divisionName}
            divisionName={divisionName}
            divisionData={divisionData}
          />
        ))}
      </div>

      {/* Total Keseluruhan */}
      <div className="bg-accentColor rounded-xl shadow-lg p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-100">Total anggaran untuk program kerja</p>
            <h3 className="text-2xl font-bold mb-2">Total Keseluruhan RAB</h3>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-2">
              {formatCurrency(grandTotal)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
