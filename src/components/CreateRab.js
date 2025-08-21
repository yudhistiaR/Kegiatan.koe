'use client'

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
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatCurrency } from '@/lib/utils'
import { Plus, Trash2, AlertCircle, Receipt, Calculator } from 'lucide-react'

const CreateRab = () => {
  const { orgId } = useAuth()
  const { prokerId, divisiId } = useParams()
  const queryClient = useQueryClient()

  const [nama, setNama] = useState('')
  const [harga, setHarga] = useState('')
  const [jumlah, setJumlah] = useState('')
  const [satuan, setSatuan] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const {
    data: rabResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['rab-divisi', divisiId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/proker/divisi/${divisiId}/rab`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      return data
    }
  })

  const rabData = useMemo(() => {
    if (
      !rabResponse ||
      !Array.isArray(rabResponse) ||
      rabResponse.length === 0
    ) {
      return null
    }
    return rabResponse[0]
  }, [rabResponse])

  const tableData = useMemo(() => {
    return rabData?.listRab || []
  }, [rabData])

  const { mutate: deleteRabItem, isPending: isDeleting } = useMutation({
    mutationFn: async itemId => {
      const response = await fetch(
        `/api/v1/proker/divisi/${divisiId}/rab/${itemId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Gagal menghapus item')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rab-divisi', divisiId] })
    },
    onError: error => {
      console.error('Error deleting item:', error)
    }
  })

  const { mutate: addRabItem, isPending: isAdding } = useMutation({
    mutationFn: async newItem => {
      const response = await fetch(`/api/v1/proker/divisi/${divisiId}/rab`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      })

      if (!response.ok) {
        throw new Error('Gagal menambahkan item')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rab-divisi', divisiId] })
      // Reset form
      setNama('')
      setHarga('')
      setJumlah('')
      setSatuan('')
    },
    onError: error => {
      console.error('Error adding item:', error)
    }
  })

  const handleDelete = useCallback(
    itemId => {
      deleteRabItem(itemId)
    },
    [deleteRabItem]
  )

  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      columnHelper.accessor('nama', {
        header: 'Nama Item',
        cell: info => (
          <div className="font-medium text-foreground">{info.getValue()}</div>
        )
      }),
      columnHelper.accessor('harga', {
        header: 'Harga Satuan',
        cell: info => (
          <div className="text-right font-mono">
            {formatCurrency(Number.parseFloat(info.getValue()))}
          </div>
        )
      }),
      columnHelper.accessor('jumlah', {
        header: 'Jumlah',
        cell: info => <div className="text-center">{info.getValue()}</div>
      }),
      columnHelper.accessor('satuan', {
        header: 'Satuan',
        cell: info => (
          <Badge variant="secondary" className="text-xs">
            {info.getValue()}
          </Badge>
        )
      }),
      columnHelper.display({
        id: 'total',
        header: 'Total',
        cell: ({ row }) => {
          const harga = Number.parseFloat(row.original.harga) || 0
          const jumlah = Number.parseFloat(row.original.jumlah) || 0
          return (
            <div className="text-right font-mono font-semibold text-primary">
              {formatCurrency(harga * jumlah)}
            </div>
          )
        }
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive bg-transparent"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Hapus Item Anggaran
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {`Apakah Anda yakin ingin menghapus item "${row.original.nama}"? Tindakan ini tidak dapat dibatalkan.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(row.original.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Menghapus...' : 'Hapus'}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      })
    ],
    [columnHelper, handleDelete, isDeleting]
  )

  const table = useReactTable({
    data: tableData,
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
      addRabItem({
        orgId: orgId,
        prokerId: prokerId,
        divisiId: divisiId,
        nama,
        harga,
        jumlah,
        satuan
      })
    }
  }

  const totalAnggaran = useMemo(() => {
    return tableData.reduce((sum, item) => {
      const harga = Number.parseFloat(item.harga) || 0
      const jumlah = Number.parseFloat(item.jumlah) || 0
      return sum + harga * jumlah
    }, 0)
  }, [tableData])

  const isFormValid = nama && harga && jumlah && satuan
  const previewTotal = isFormValid
    ? (Number.parseFloat(harga) || 0) * (Number.parseFloat(jumlah) || 0)
    : 0

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Gagal memuat data: {error.message}</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Coba Lagi
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {rabData && (
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Rencana Anggaran Biaya
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{rabData.proker.title}</span>
            <span>•</span>
            <span>Divisi {rabData.divisi.name}</span>
            <span>•</span>
            <Badge
              variant={rabData.status === 'DRAF' ? 'secondary' : 'default'}
            >
              {rabData.status}
            </Badge>
            {is}
            <span>•</span>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Tambah Item Anggaran
          </CardTitle>
          <CardDescription>
            Masukkan detail item anggaran yang akan ditambahkan ke dalam RAB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Item *</Label>
              <Input
                id="nama"
                value={nama}
                onChange={e => setNama(e.target.value)}
                placeholder="Contoh: Spanduk Banner"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="harga">Harga Satuan (Rp) *</Label>
              <Input
                id="harga"
                type="number"
                value={harga}
                onChange={e => setHarga(e.target.value)}
                placeholder="50000"
                className="w-full"
                min="0"
                step="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jumlah">Jumlah *</Label>
              <Input
                id="jumlah"
                type="number"
                value={jumlah}
                onChange={e => setJumlah(e.target.value)}
                placeholder="2"
                className="w-full"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="satuan">Satuan *</Label>
              <Input
                id="satuan"
                value={satuan}
                onChange={e => setSatuan(e.target.value)}
                placeholder="pcs, kg, buah, dll"
                className="w-full"
              />
            </div>
          </div>

          {isFormValid && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span>Preview Total:</span>
                <span className="font-mono font-semibold text-primary">
                  {formatCurrency(previewTotal)}
                </span>
              </div>
            </div>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={!isFormValid || isAdding}
                className="w-full md:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isAdding ? 'Menambahkan...' : 'Tambahkan Item'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Tambah Item</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-3">
                    <p>Pastikan data berikut sudah benar:</p>
                    <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Item:</span>
                        <span className="font-medium">{nama}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Harga:</span>
                        <span className="font-mono">
                          {formatCurrency(Number.parseFloat(harga) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jumlah:</span>
                        <span>
                          {jumlah} {satuan}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1 font-semibold">
                        <span>Total:</span>
                        <span className="font-mono text-primary">
                          {formatCurrency(previewTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button onClick={handleAdd} disabled={isAdding}>
                    {isAdding ? 'Menambahkan...' : 'Tambahkan'}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Daftar Item Anggaran
          </CardTitle>
          <CardDescription>
            {tableData.length > 0
              ? `${tableData.length} item dalam anggaran`
              : 'Belum ada item anggaran'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tableData.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map(header => (
                            <th
                              key={header.id}
                              className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
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
                    <tbody className="divide-y divide-border">
                      {table.getRowModel().rows.map(row => (
                        <tr
                          key={row.id}
                          className="hover:bg-muted/25 transition-colors"
                        >
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

              {table.getPageCount() > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Menampilkan{' '}
                    {table.getState().pagination.pageIndex *
                      table.getState().pagination.pageSize +
                      1}{' '}
                    -{' '}
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) *
                        table.getState().pagination.pageSize,
                      tableData.length
                    )}{' '}
                    dari {tableData.length} item
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-lg">
                      Total Anggaran:
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-primary font-mono">
                    {formatCurrency(totalAnggaran)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Belum Ada Item Anggaran
              </h3>
              <p className="text-muted-foreground mb-4">
                Mulai tambahkan item anggaran menggunakan form di atas
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateRab
