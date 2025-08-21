'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Edit, Save, X } from 'lucide-react'

const fundingSourceSchema = z.object({
  sumber: z
    .string()
    .min(3, { message: 'Nama sumber harus diisi (min. 3 karakter).' }),
  type: z.string({ required_error: 'Tipe sumber dana harus dipilih.' }),
  jumlah: z.number().positive({ message: 'Jumlah dana harus lebih dari 0.' }),
  kontak: z.string().optional(),
  catatan: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED'])
})

export function EditFundingSourceDialog({ fundingSource, trigger }) {
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(fundingSourceSchema)
  })

  useEffect(() => {
    if (fundingSource) {
      reset({
        sumber: fundingSource.sumber || '',
        type: fundingSource.type || undefined,
        jumlah: Number.parseInt(fundingSource.jumlah) || 0,
        kontak: fundingSource.kontak || '',
        catatan: fundingSource.catatan || '',
        status: fundingSource.status || 'PENDING'
      })
    }
  }, [fundingSource, reset])

  const { mutate: updateFundingSource, isPending } = useMutation({
    mutationFn: async data => {
      const res = await fetch(`/api/v1/${fundingSource.id}/dana/pendanaan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        throw new Error('Gagal memperbarui sumber dana')
      }
      return res.json()
    },
    onSuccess: () => {
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['detail-pendanaan'] })
    },
    onError: () => {
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['detail-pendanaan'] })
    }
  })

  const onSubmit = data => {
    updateFundingSource(data)
  }

  const handleCancel = () => {
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-[#4b6fd7]/20"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-[#2d3154] border-[#3d4166] overflow-y-auto max-h-[500px]">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Sumber Dana</DialogTitle>
          <DialogDescription className="text-gray-400">
            Edit informasi sumber pendanaan untuk program kerja ini
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Sumber Dana */}
          <div className="space-y-2">
            <Label htmlFor="sumber" className="text-sm font-medium text-white">
              Nama Sumber Dana *
            </Label>
            <Input
              id="sumber"
              {...register('sumber')}
              className="bg-[#25294a] border-[#3d4166] text-white"
            />
            {errors.sumber && (
              <p className="text-xs text-red-400">{errors.sumber.message}</p>
            )}
          </div>

          {/* Tipe Sumber Dana */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-white">
              Tipe Sumber Dana *
            </Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-[#25294a] border-[#3d4166] text-white">
                    <SelectValue placeholder="Pilih tipe sumber dana" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2d3154] border-[#3d4166]">
                    <SelectItem
                      value="Sponsor"
                      className="text-white hover:bg-[#4b6fd7]/20"
                    >
                      Sponsor
                    </SelectItem>
                    <SelectItem
                      value="Hibah"
                      className="text-white hover:bg-[#4b6fd7]/20"
                    >
                      Hibah
                    </SelectItem>
                    <SelectItem
                      value="Donasi"
                      className="text-white hover:bg-[#4b6fd7]/20"
                    >
                      Donasi
                    </SelectItem>
                    <SelectItem
                      value="Internal"
                      className="text-white hover:bg-[#4b6fd7]/20"
                    >
                      Dana Internal
                    </SelectItem>
                    <SelectItem
                      value="Lainnya"
                      className="text-white hover:bg-[#4b6fd7]/20"
                    >
                      Lainnya
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-xs text-red-400">{errors.type.message}</p>
            )}
          </div>

          {/* Jumlah Dana */}
          <div className="space-y-2">
            <Label htmlFor="jumlah" className="text-sm font-medium text-white">
              Jumlah Dana *
            </Label>
            <Input
              id="jumlah"
              type="number"
              {...register('jumlah', { valueAsNumber: true })}
              className="bg-[#25294a] border-[#3d4166] text-white"
            />
            {errors.jumlah && (
              <p className="text-xs text-red-400">{errors.jumlah.message}</p>
            )}
          </div>

          {/* Kontak */}
          <div className="space-y-2">
            <Label htmlFor="kontak" className="text-sm font-medium text-white">
              Kontak Person
            </Label>
            <Input
              id="kontak"
              {...register('kontak')}
              className="bg-[#25294a] border-[#3d4166] text-white"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-white">
              Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-[#25294a] border-[#3d4166] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2d3154] border-[#3d4166]">
                    <SelectItem
                      value="PENDING"
                      className="text-white hover:bg-[#4b6fd7]/20"
                    >
                      Menunggu Konfirmasi
                    </SelectItem>
                    <SelectItem
                      value="APPROVED"
                      className="text-white hover:bg-[#4b6fd7]/20"
                    >
                      Sudah Dikonfirmasi
                    </SelectItem>
                    <SelectItem
                      value="REJECTED"
                      className="text-white hover:bg-[#4b6fd7]/20"
                    >
                      Ditolak
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Catatan */}
          <div className="space-y-2">
            <Label htmlFor="catatan" className="text-sm font-medium text-white">
              Catatan
            </Label>
            <Textarea
              id="catatan"
              {...register('catatan')}
              className="bg-[#25294a] border-[#3d4166] text-white"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
              className="border-[#3d4166] text-white hover:bg-[#3d4166] bg-transparent"
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#4b6fd7] hover:bg-[#3d5bc7] text-white disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
