'use client'

import { formatCurrency } from '@/lib/utils'
import { useAuth } from '@clerk/nextjs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useMemo, useState, useCallback } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { LoadingState, ErrorState } from '../LoadState/LoadStatus'

const CreateRab = () => {
  const { orgId } = useAuth()
  const { divisiId, prokerId } = useParams()
  const queryClient = useQueryClient()
  const [nama, setNama] = useState('')
  const [harga, setHarga] = useState('')
  const [jumlah, setJumlah] = useState('')
  const [satuan, setSatuan] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  // Create column helper
  const columnHelper = createColumnHelper()

  const { mutate: deleteMutation } = useMutation({
    mutationFn: async itemId => {
      const response = await fetch(
        `/api/v1/proker/divisi/${divisiId}/rab/${itemId}`,
        {
          method: 'DELETE'
        }
      )
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rab-proker', divisiId])
    }
  })

  const handleDelete = useCallback(
    itemId => {
      deleteMutation(itemId)
    },
    [deleteMutation]
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('nama', {
        id: 'nama',
        header: 'Nama Item',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('harga', {
        id: 'harga',
        header: 'Harga Satuan',
        cell: info => {
          const value = parseFloat(info.getValue())
          return formatCurrency(value)
        }
      }),
      columnHelper.accessor('jumlah', {
        id: 'jumlah',
        header: 'Jumlah',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('satuan', {
        id: 'satuan',
        header: 'Satuan',
        cell: info => info.getValue()
      }),
      columnHelper.display({
        id: 'total',
        header: 'Total',
        cell: ({ row }) => {
          const harga = parseFloat(row.original.harga) || 0
          const jumlah = parseFloat(row.original.jumlah) || 0
          const total = harga * jumlah
          return formatCurrency(total)
        }
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus item anggaran?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(row.original.id)}
                  >
                    Hapus
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      })
    ],
    [columnHelper, handleDelete]
  )

  const {
    data: rabData,
    isLoading,
    isPending,
    error
  } = useQuery({
    queryKey: ['rab-proker', divisiId],
    queryFn: async () => {
      const req = await fetch(`/api/v1/proker/divisi/${divisiId}/rab`)
      const response = await req.json()
      return Array.isArray(response) ? response : response.data || []
    }
  })

  const { mutate: addMutation } = useMutation({
    mutationFn: async newItem => {
      const response = await fetch(`/api/v1/proker/divisi/${divisiId}/rab`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rab-proker', divisiId])
      setNama('')
      setHarga('')
      setJumlah('')
      setSatuan('')
    }
  })

  const table = useReactTable({
    data: rabData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination
    }
  })

  const handleAdd = () => {
    if (nama && harga && jumlah && satuan) {
      addMutation.mutate({
        divisiId: divisiId,
        prokerId: prokerId,
        orgId: orgId,
        nama,
        harga,
        jumlah,
        satuan
      })
    }
  }

  const totalAnggaran =
    rabData?.reduce((sum, item) => {
      const harga = parseFloat(item.harga) || 0
      const jumlah = parseFloat(item.jumlah) || 0
      return sum + harga * jumlah
    }, 0) || 0

  if (isLoading || isPending) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Form Input */}
      <div className="p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Tambah Item Anggaran</h3>
        <div className="flex justify-center items-end gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nama Item</Label>
            <Input
              id="nama"
              value={nama}
              onChange={e => setNama(e.target.value)}
              placeholder="Masukkan nama item"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="harga">Harga Satuan (Rp)</Label>
            <Input
              id="harga"
              type="number"
              value={harga}
              onChange={e => setHarga(e.target.value)}
              placeholder="Masukkan harga"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="jumlah">Jumlah</Label>
            <Input
              id="jumlah"
              type="number"
              value={jumlah}
              onChange={e => setJumlah(e.target.value)}
              placeholder="Masukkan jumlah"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="satuan">Satuan</Label>
            <Input
              id="satuan"
              value={satuan}
              onChange={e => setSatuan(e.target.value)}
              placeholder="pcs, kg, buah, dll"
            />
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={
                  !nama || !harga || !jumlah || !satuan || addMutation.isPending
                }
              >
                {addMutation.isPending ? 'Menambahkan...' : 'Tambahkan'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tambahkan anggaran?</AlertDialogTitle>
                <div className="text-sm space-y-1">
                  <p>Item: {nama}</p>
                  <p>
                    Harga:{' '}
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    }).format(parseFloat(harga) || 0)}
                  </p>
                  <p>
                    Jumlah: {jumlah} {satuan}
                  </p>
                  <p className="font-semibold">
                    Total:{' '}
                    {formatCurrency(
                      (parseFloat(harga) || 0) * (parseFloat(jumlah) || 0)
                    )}
                  </p>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button onClick={handleAdd}>Kirim</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Rencana Anggaran Biaya</h3>
        </div>
        {rabData && rabData.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
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
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm"
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
              </table>
            </div>

            {/* Total */}
            <div className="p-4 border-t ">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Anggaran:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(totalAnggaran)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>Belum ada data anggaran</p>
            <p className="text-sm">
              Tambahkan item anggaran menggunakan form di atas
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateRab
