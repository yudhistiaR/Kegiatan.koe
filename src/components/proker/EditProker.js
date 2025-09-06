'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { Edit } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { SingleSelect } from '../ui/CustomeSelect'
import { toast } from 'sonner'

const EditProker = ({ orgId, prokerId, datas }) => {
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()

  const flattenData = data =>
    data.map(itm => ({
      value: itm.user.id,
      label: itm.user.fullName
    }))

  const { data, isLoading } = useQuery({
    queryKey: ['org_mem', orgId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/organisasi/${orgId}/member`)
      return res.json()
    },
    select: flattenData
  })

  const { mutate: updateProker, isPending } = useMutation({
    mutationFn: async data => {
      const res = await fetch(`/api/v2/${orgId}/proker/${prokerId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      })
      if (!res.ok) throw new Error('Gagal mengupdate program kerja')
      return res.json()
    },
    onSuccess: () => toast.success('Berhasil mengupdate program kerja'),
    onError: error => toast.error(error.message),
    onSettled: () => {
      queryClient.invalidateQueries(['proker-list'])
      setOpen(false)
    }
  })

  const formatDate = dateString =>
    dateString ? new Date(dateString).toISOString().split('T')[0] : ''

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      title: datas?.title || '',
      description: datas?.description || '',
      start: datas?.start ? formatDate(datas.start) : '',
      end: datas?.end ? formatDate(datas.end) : ''
    }
  })

  const handleUpdate = formData => {
    const payload = {
      title: formData.title,
      description: formData.description,
      start: formData.start,
      end: formData.end,
      ketuaPelaksanaId: formData.ketua_pelaksana?.value || null
    }

    updateProker(payload)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-accentColor/20 hover:ring ring-accentColor"
            >
              <Edit className="text-green-600" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Program Kerja</DialogTitle>
          <DialogDescription>Mengedit program kerja</DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <form
          id="edit-proker-form"
          className="my-3 space-y-4"
          onSubmit={handleSubmit(handleUpdate)}
        >
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="title">Nama Program Kerja</Label>
            <Input id="title" type="text" {...register('title')} />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="ketuaPe">Ketua Pelaksanaan</Label>
            <Controller
              name="ketua_pelaksana"
              control={control}
              defaultValue={
                datas?.ketua_pelaksana
                  ? {
                      value: datas.ketua_pelaksana.id,
                      label: datas.ketua_pelaksana.fullName
                    }
                  : null
              }
              render={({ field }) => (
                <SingleSelect
                  options={data || []}
                  isLoading={isLoading}
                  {...field}
                />
              )}
            />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="description">Deskripsi</Label>
            <textarea
              maxLength={300}
              placeholder="Deskripsi program kerja"
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              {...register('description')}
            />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="start">Tanggal Persiapan</Label>
            <Input id="start" type="date" {...register('start')} />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="end">Tanggal Pelaksanaan</Label>
            <Input id="end" type="date" {...register('end')} />
          </div>
        </form>

        {/* FOOTER */}
        <DialogFooter>
          <DialogClose asChild>
            <Button size="sm" variant="outline">
              Tidak
            </Button>
          </DialogClose>
          <Button
            size="sm"
            type="submit"
            form="edit-proker-form"
            disabled={isPending}
          >
            {isPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditProker
