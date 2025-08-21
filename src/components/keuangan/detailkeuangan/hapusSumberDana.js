'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export function DeleteFundingSourceAlert({ fundingSource, trigger }) {
  const queryClient = useQueryClient()

  const { mutate: deleteFundingSource, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/${fundingSource.id}/dana/pendanaan`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Gagal menghapus sumber dana')
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detail-pendanaan'] })
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['detail-pendanaan'] })
    }
  })

  const handleDelete = () => {
    deleteFundingSource()
  }

  const getStatusText = status => {
    switch (status) {
      case 'APPROVED':
        return 'Disetujui'
      case 'PENDING':
        return 'Menunggu'
      case 'REJECTED':
        return 'Ditolak'
      default:
        return status
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-400'
      case 'PENDING':
        return 'text-yellow-400'
      case 'REJECTED':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-red-400 hover:bg-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#2d3154] border-[#3d4166]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Hapus Sumber Dana
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Apakah Anda yakin ingin menghapus sumber dana ini? Tindakan ini
            tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Detail Sumber Dana */}
        <div className="bg-[#25294a] rounded-lg p-4 my-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Sumber Dana:</span>
              <span className="text-white font-medium">
                {fundingSource.sumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Jumlah:</span>
              <span className="text-white font-medium">
                {formatCurrency(Number.parseInt(fundingSource.jumlah) || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Status:</span>
              <span
                className={`font-medium ${getStatusColor(fundingSource.status)}`}
              >
                {getStatusText(fundingSource.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Peringatan untuk dana yang sudah disetujui */}
        {fundingSource.status === 'APPROVED' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-300 text-sm">
              <strong>Peringatan:</strong> Sumber dana ini sudah disetujui.
              Menghapusnya akan mempengaruhi perhitungan total pendanaan.
            </p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel className="border-[#3d4166] text-white hover:bg-[#3d4166] bg-transparent">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
