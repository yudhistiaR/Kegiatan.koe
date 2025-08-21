'use client'

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Eye,
  CheckCircle as ReviewIcon,
  FileText,
  Clock,
  XCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown
} from 'lucide-react'

const columnHelper = createColumnHelper()

const getStatusBadge = status => {
  const statusConfig = {
    PENDING: { label: 'Pending', icon: Clock, color: 'bg-yellow-500' },
    APPROVED: { label: 'Disetujui', icon: CheckCircle, color: 'bg-green-500' },
    REJECTED: { label: 'Ditolak', icon: XCircle, color: 'bg-red-500' }
  }
  const config = statusConfig[status] || statusConfig.PENDING
  const Icon = config.icon
  return (
    <Badge className={`${config.color} text-white border-0`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}

export function BudgetTable({ data, onViewDetail, onUpdateStatus }) {
  const [sorting, setSorting] = useState([])

  const columns = useMemo(
    () => [
      columnHelper.accessor('proker.title', {
        header: 'Program Kerja',
        cell: info => (
          <div className="font-medium text-white">{info.getValue()}</div>
        )
      }),
      columnHelper.accessor('proker.ketua_pelaksana.fullName', {
        header: 'Ketua Pelaksana',
        cell: info => <div className="text-gray-300">{info.getValue()}</div>
      }),
      columnHelper.accessor('divisi.name', {
        header: 'Divisi',
        cell: info => <div className="text-gray-300">{info.getValue()}</div>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => getStatusBadge(info.getValue())
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetail(row.original)}
            >
              <Eye className="w-3 h-3 mr-1" /> Detail
            </Button>
            {row.original.status === 'PENDING' && (
              <Button size="sm" onClick={() => onUpdateStatus(row.original)}>
                <ReviewIcon className="w-3 h-3 mr-1" /> Review
              </Button>
            )}
          </div>
        )
      })
    ],
    [onViewDetail, onUpdateStatus]
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  if (!data || data.length === 0) {
    // Menambahkan pengecekan data
    return (
      <div className="text-center py-12 text-gray-400">
        <FileText className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white">Tidak ada data</h3>
        <p>Belum ada RAB untuk kategori ini.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-gray-700">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="border-gray-700">
                {headerGroup.headers.map(header => {
                  // --- (PERUBAHAN 2) Modifikasi render header ---
                  return (
                    <TableHead
                      key={header.id}
                      className="text-gray-300 cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ArrowUp className="h-4 w-4" />,
                          desc: <ArrowDown className="h-4 w-4" />
                        }[header.column.getIsSorted()] ??
                          // Tampilkan ikon netral jika kolom bisa di-sort tapi belum di-sort
                          (header.column.getCanSort() ? (
                            <ChevronsUpDown className="h-4 w-4 opacity-30" />
                          ) : null)}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                className="border-gray-700 hover:bg-accentColor transition-colors duration-200"
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
