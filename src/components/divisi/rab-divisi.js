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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { formatCurrency } from '@/lib/utils'
import {
  Plus,
  Trash2,
  AlertCircle,
  Receipt,
  Calculator,
  Lock,
  Loader2,
  MessageSquareWarning,
  ListRestart
} from 'lucide-react'
import { LoadingState, ErrorState } from '../LoadState/LoadStatus'

const getStatusBadgeVariant = status => {
  switch (status) {
    case 'APPROVED':
      return 'success'
    case 'REJECTED':
      return 'destructive'
    case 'PENDING':
      return 'warning'
    default:
      return 'secondary'
  }
}

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
    isError,
    error
  } = useQuery({
    queryKey: ['rab', divisiId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/proker/divisi/${divisiId}/rab`)
      if (!response.ok) {
        throw new Error(`Gagal memuat data RAB: ${response.statusText}`)
      }
      return await response.json()
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

  const isApproved = rabData?.status === 'APPROVED'
  const isRejected = rabData?.status === 'REJECTED'
  const isLocked = isApproved || isRejected

  const tableData = useMemo(() => {
    return rabData?.listRab || []
  }, [rabData])

  const { mutate: deleteRabItem, isPending: isDeleting } = useMutation({
    mutationFn: async itemId => {
      const response = await fetch(
        `/api/v1/proker/divisi/${divisiId}/rab/${itemId}`,
        { method: 'DELETE' }
      )
      if (!response.ok) throw new Error('Gagal menghapus item')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rab-divisi', divisiId] })
    },
    onError: error => {
      console.error('Error deleting item:', error)
    }
  })

  const { mutate: updateRevisiRab } = useMutation({
    mutationFn: async data => {
      const response = await fetch(
        `/api/v1/proker/divisi/${divisiId}/rab/revisi`,
        {
          body: JSON.stringify(data),
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (!response.ok) throw new Error('Gagal menghapus item')

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
      if (!response.ok) throw new Error('Gagal menambahkan item')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rab-divisi', divisiId] })
      setNama('')
      setHarga('')
      setJumlah('')
      setSatuan('')
    },
    onError: error => {
      console.error('Error adding item:', error)
    }
  })

  const handleUpdateRevisi = useCallback(
    data => {
      updateRevisiRab(data)
    },
    [updateRevisiRab]
  )

  const handleDelete = useCallback(
    itemId => {
      deleteRabItem(itemId)
    },
    [deleteRabItem]
  )

  const handleAdd = () => {
    if (nama && harga && jumlah && satuan) {
      addRabItem({
        orgId,
        prokerId,
        divisiId,
        nama,
        harga,
        jumlah,
        satuan
      })
    }
  }

  const columnHelper = createColumnHelper()
  const columns = useMemo(
    () => [
      columnHelper.accessor('nama', {
        header: 'Nama Item',
        cell: info => <div className="font-medium">{info.getValue()}</div>
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
        header: () => <div className="text-right">Total</div>,
        cell: ({ row }) => {
          const harga = Number.parseFloat(row.original.harga) || 0
          const jumlah = Number.parseFloat(row.original.jumlah) || 0
          return (
            <div className="text-right font-mono font-semibold">
              {formatCurrency(harga * jumlah)}
            </div>
          )
        }
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-white hover:bg-destructive bg-transparent"
                  disabled={isDeleting || isLocked}
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
          </div>
        )
      })
    ],
    [handleDelete, isDeleting, isLocked]
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
    return <LoadingState />
  }

  if (isError) {
    return <ErrorState error={error} />
  }

  console.log(rabData)

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {rabData && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Rencana Anggaran Biaya
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{rabData.proker.title}</span>
              <span>•</span>
              <span>Divisi {rabData.divisi.name}</span>
              <span>•</span>
              <Badge variant={getStatusBadgeVariant(rabData.status)}>
                {rabData.status}
              </Badge>
              {isRejected && (
                <>
                  <span>•</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="rounded-full"
                        onClick={() =>
                          handleUpdateRevisi({
                            id: rabData.id,
                            total_revisi: rabData.total_revisi
                          })
                        }
                      >
                        <ListRestart size={5} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="shadow-lg">
                      <p>Perbarui List RAB</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </div>

          {isApproved && (
            <Alert
              variant="success"
              className="bg-green-100 border-green-400 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300"
            >
              <Lock className="h-4 w-4" />
              <AlertTitle>Anggaran Telah Disetujui</AlertTitle>
              <AlertDescription asChild>
                <p>RAB ini bersifat final dan tidak dapat diubah lagi.</p>
                {rabData.note && (
                  <div className="bg-green-200 w-full p-2 rounded-md">
                    <h3 className="font-bold">Dengan Catatan :</h3>
                    <p>{rabData.note}</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {isRejected && rabData.note && (
            <Alert variant="destructive">
              <MessageSquareWarning className="h-4 w-4" />
              <AlertTitle>Anggaran Ditolak dengan Catatan Revisi</AlertTitle>
              <AlertDescription>
                <p className="mt-2 p-3 bg-destructive/10 rounded-md w-full text-justify">
                  {rabData.note}
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Tambah Item Anggaran
          </CardTitle>
          <CardDescription>
            Masukkan detail item anggaran. Form akan dinonaktifkan jika RAB
            telah disetujui.
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
                disabled={isLocked}
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
                min="0"
                disabled={isLocked}
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
                min="1"
                disabled={isLocked}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="satuan">Satuan *</Label>
              <Input
                id="satuan"
                value={satuan}
                onChange={e => setSatuan(e.target.value)}
                placeholder="pcs, kg, buah"
                disabled={isLocked}
              />
            </div>
          </div>

          {isFormValid && (
            <div className="mb-4 p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span>Preview Total:</span>
                <span className="font-mono font-semibold">
                  {formatCurrency(previewTotal)}
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={handleAdd}
            disabled={!isFormValid || isAdding || isLocked}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAdding ? 'Menambahkan...' : 'Tambahkan Item'}
          </Button>
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
              ? `Total ${tableData.length} item dalam anggaran`
              : 'Belum ada item anggaran yang ditambahkan'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tableData.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th
                            key={header.id}
                            className="px-4 py-3 text-left font-medium text-muted-foreground"
                          >
                            {flexRender(
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
                      <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="px-4 py-3">
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
              <div className="border-t pt-4">
                <div className="flex items-center justify-between p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-6 w-6" />
                    <span className="font-semibold text-lg">
                      Total Anggaran:
                    </span>
                  </div>
                  <span className="text-2xl font-bold font-mono">
                    {formatCurrency(totalAnggaran)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                Belum Ada Item Anggaran
              </h3>
              <p className="mb-4">
                Mulai tambahkan item menggunakan form di atas.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateRab
