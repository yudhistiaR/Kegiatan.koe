// components/OrganizationMembersTable.js
'use client'

import React, { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table'
import { Input } from '../ui/input'

// Data mock untuk contoh
const mockMembersData = [
  // Tambahkan lebih banyak data untuk menguji paginasi
  {
    id: 'user_1',
    name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    role: 'admin',
    joinedAt: '2023-01-15'
  },
  {
    id: 'user_2',
    name: 'Siti Aminah',
    email: 'siti.aminah@example.com',
    role: 'member',
    joinedAt: '2023-03-20'
  },
  {
    id: 'user_3',
    name: 'Joko Susilo',
    email: 'joko.susilo@example.com',
    role: 'member',
    joinedAt: '2023-02-10'
  },
  {
    id: 'user_4',
    name: 'Dewi Rahayu',
    email: 'dewi.rahayu@example.com',
    role: 'member',
    joinedAt: '2023-04-05'
  },
  {
    id: 'user_5',
    name: 'Agus Salim',
    email: 'agus.salim@example.com',
    role: 'member',
    joinedAt: '2023-05-12'
  },
  {
    id: 'user_6',
    name: 'Rina Wijaya',
    email: 'rina.wijaya@example.com',
    role: 'member',
    joinedAt: '2023-06-25'
  },
  {
    id: 'user_7',
    name: 'Eko Prasetyo',
    email: 'eko.prasetyo@example.com',
    role: 'member',
    joinedAt: '2023-07-01'
  },
  {
    id: 'user_8',
    name: 'Lisa Handayani',
    email: 'lisa.handayani@example.com',
    role: 'member',
    joinedAt: '2023-08-18'
  },
  {
    id: 'user_9',
    name: 'Faisal Akbar',
    email: 'faisal.akbar@example.com',
    role: 'member',
    joinedAt: '2023-09-03'
  },
  {
    id: 'user_10',
    name: 'Maya Lestari',
    email: 'maya.lestari@example.com',
    role: 'member',
    joinedAt: '2023-10-11'
  },
  {
    id: 'user_11',
    name: 'Hadi Gunawan',
    email: 'hadi.gunawan@example.com',
    role: 'member',
    joinedAt: '2023-11-29'
  },
  {
    id: 'user_12',
    name: 'Nurul Hidayati',
    email: 'nurul.hidayati@example.com',
    role: 'member',
    joinedAt: '2023-12-05'
  },
  {
    id: 'user_13',
    name: 'Yoga Pratama',
    email: 'yoga.pratama@example.com',
    role: 'member',
    joinedAt: '2024-01-22'
  },
  {
    id: 'user_14',
    name: 'Ratna Sari',
    email: 'ratna.sari@example.com',
    role: 'member',
    joinedAt: '2024-02-14'
  },
  {
    id: 'user_15',
    name: 'Taufik Rahman',
    email: 'taufik.rahman@example.com',
    role: 'member',
    joinedAt: '2024-03-30'
  },
  {
    id: 'user_16',
    name: 'Wulan Susanti',
    email: 'wulan.susanti@example.com',
    role: 'member',
    joinedAt: '2024-04-19'
  },
  {
    id: 'user_17',
    name: 'Zainal Arifin',
    email: 'zainal.arifin@example.com',
    role: 'member',
    joinedAt: '2024-05-08'
  },
  {
    id: 'user_18',
    name: 'Kartika Chandra',
    email: 'kartika.chandra@example.com',
    role: 'member',
    joinedAt: '2024-06-11'
  },
  {
    id: 'user_19',
    name: 'Bayu Nugroho',
    email: 'bayu.nugroho@example.com',
    role: 'member',
    joinedAt: '2024-07-07'
  },
  {
    id: 'user_20',
    name: 'Cindy Puspita',
    email: 'cindy.puspita@example.com',
    role: 'member',
    joinedAt: '2024-08-21'
  },
  {
    id: 'user_21',
    name: 'Dedy Irawan',
    email: 'dedy.irawan@example.com',
    role: 'member',
    joinedAt: '2024-09-10'
  },
  {
    id: 'user_22',
    name: 'Fitriani',
    email: 'fitriani@example.com',
    role: 'member',
    joinedAt: '2024-10-05'
  },
  {
    id: 'user_23',
    name: 'Guruh Setiawan',
    email: 'guruh.setiawan@example.com',
    role: 'member',
    joinedAt: '2024-11-13'
  },
  {
    id: 'user_24',
    name: 'Intan Permata',
    email: 'intan.permata@example.com',
    role: 'member',
    joinedAt: '2024-12-25'
  },
  {
    id: 'user_25',
    name: 'Kevin Santoso',
    email: 'kevin.santoso@example.com',
    role: 'member',
    joinedAt: '2025-01-08'
  },
  {
    id: 'user_26',
    name: 'Lia Marlina',
    email: 'lia.marlina@example.com',
    role: 'member',
    joinedAt: '2025-02-17'
  },
  {
    id: 'user_27',
    name: 'Mochamad Rizky',
    email: 'mochamad.rizky@example.com',
    role: 'member',
    joinedAt: '2025-03-29'
  },
  {
    id: 'user_28',
    name: 'Nita Rosiana',
    email: 'nita.rosiana@example.com',
    role: 'member',
    joinedAt: '2025-04-03'
  },
  {
    id: 'user_29',
    name: 'Oscar Wijaya',
    email: 'oscar.wijaya@example.com',
    role: 'member',
    joinedAt: '2025-05-16'
  },
  {
    id: 'user_30',
    name: 'Puspa Indah',
    email: 'puspa.indah@example.com',
    role: 'member',
    joinedAt: '2025-06-09'
  }
]

export default function ListAnggota() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])

  const columns = useMemo(
    () => [
      { accessorKey: 'no', header: 'No', cell: ({ row }) => row.index + 1 },
      { accessorKey: 'name', header: 'Name', cell: info => info.getValue() },
      { accessorKey: 'email', header: 'Email', cell: info => info.getValue() },
      { accessorKey: 'role', header: 'Peran', cell: info => info.getValue() },
      {
        accessorKey: 'joinedAt',
        header: 'bergagung',
        cell: info => info.getValue()
      }
    ],
    []
  )

  const table = useReactTable({
    data: mockMembersData,
    columns,
    state: {
      globalFilter,
      sorting
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <div className="flex flex-col h-screen">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Daftar Anggota Organisasi</h1>
        <p className="text-zinc-400">
          Disini anda datapat memberikan hak akses untuk anggota organisasi anda
        </p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="max-w-sm w-full"
          placeholder="Cari..."
        />
        {/* Kontrol Paginasi - Opsi Baris */}
        <div className="flex items-center space-x-2">
          <span className="text-sm">List Anggota :</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
            className="px-2 py-1 border rounded-md text-sm"
          >
            {[10, 50, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kontainer Tabel dengan Scroll */}
      <div className="flex-grow overflow-y-auto border rounded-md">
        <table className="min-w-full">
          <thead className="sticky top-0 bg-accentColor z-10">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-6 py-3 text-left text-xs font-medium uppercase cursor-pointer select-none"
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{ asc: ' 🔼', desc: ' 🔽' }[
                        header.column.getIsSorted()
                      ] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b hover:bg-accentColor/50">
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kontrol Paginasi - Navigasi Halaman */}
      <div className="flex items-center justify-end mt-4 space-x-2">
        <span className="text-sm">
          Halaman {table.getState().pagination.pageIndex + 1} dari{' '}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
        >
          {'<'}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
        >
          {'>'}
        </button>
      </div>
    </div>
  )
}
