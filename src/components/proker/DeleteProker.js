'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { toast } from 'sonner'

const DeleteProker = ({ orgId, prokerId }) => {
  const queryClient = useQueryClient()

  const { mutate: deleteProker, isPending } = useMutation({
    mutationFn: async ({ orgId, prokerId }) => {
      const res = await fetch(`/api/v2/${orgId}/proker/${prokerId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Gagal menghapus program kerja')
      }

      return res
    },
    onSuccess: () => {
      toast.success('Berhasil menghapus program kerja')
    },
    onError: error => {
      toast.error(error.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['proker-list'])
    }
  })

  const handleDelete = (orgId, prokerId) => {
    deleteProker({ orgId, prokerId })
  }

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-accentColor/20 hover:ring ring-accentColor"
            >
              <Trash className="text-red-600" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Hapus</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apakah anda yakin?</DialogTitle>
          <DialogDescription>
            Data yang di hapus akan hilang dan tidak bisa pulihkan lagi
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            size="sm"
            disabled={isPending}
            onClick={() => handleDelete(orgId, prokerId)}
            variant="destructive"
          >
            {isPending ? 'Menghapus...' : 'Ya, Hapus'}
          </Button>
          <DialogClose asChild>
            <Button size="sm" variant="outline">
              Tidak
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteProker
