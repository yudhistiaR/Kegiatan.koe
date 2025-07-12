'use client'

import { useId } from 'react'
import { useParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { TaskSchema } from '@/schemas/frontend/task-schema'

//components
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
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { MultipleSelect, SingleSelect } from '../ui/CustomeSelect'
import { GalleryVerticalEnd } from 'lucide-react'

const CreatedTaskDialog = () => {
  const { orgId } = useAuth()
  const { prokerId, divisiId } = useParams()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(TaskSchema.CREATE),
    defaultValues: {
      divisiId: divisiId,
      prokerId: prokerId,
      name: '',
      priority: '',
      description: '',
      assignedToIds: [],
      status: 'TODO',
      start: '',
      end: ''
    }
  })

  const flattenData = data => {
    const option = []
    data.map(itm =>
      option.push({
        value: itm.user.clerkId,
        label: itm.user.username
      })
    )
    return option
  }

  const { data, isLoading, isPending } = useQuery({
    queryKey: ['org_mem', orgId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/organisasi/${orgId}/member`)
      return res.json()
    },
    select: data => flattenData(data)
  })

  const mutation = useMutation({
    mutationFn: async data => {
      const res = await fetch(`/api/v1/proker/divisi/${divisiId}/tugas`, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message)
      }

      return res.json()
    },
    onSuccess: () => {
      toast.success('Berhasi menambah anggota')
      queryClient.invalidateQueries(['org_mem', prokerId, divisiId, orgId])
      reset()
    },
    onError: () => {
      toast.error('Gagal manambah anggota')
      reset()
    }
  })

  const onSubmit = data => {
    mutation.mutate(data)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm">
          <GalleryVerticalEnd /> Tambah Tugas
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-[890px] min-h-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Tambahkan Tugas</AlertDialogTitle>
          <AlertDialogDescription>
            Bagikan tugas ke anggota divisi anda!!!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          className="grid grid-cols-2 gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormInput
            label="Nama"
            placeholder="nama"
            error={errors.name}
            type="text"
            {...register('name')}
          />
          <div className="space-y-3">
            <Label htmlFor="dec">Deskripsi</Label>
            <textarea
              id="description"
              maxLength={300}
              placeholder="Deskripsi Tugas"
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              {...register('description')}
            />
            {errors.description ? (
              <p className="text-red-500 min-h-5 text-sm">
                {errors.description.message}
              </p>
            ) : (
              <p className="min-h-5"></p>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="priority">Prioritas Tugas</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field: { onChange, ref } }) => (
                <SingleSelect
                  inputRef={ref}
                  id="priority"
                  options={[
                    {
                      label: 'HIGH',
                      value: 'HIGH'
                    },
                    {
                      label: 'MEDIUM',
                      value: 'MEDIUM'
                    },
                    {
                      label: 'LOW',
                      value: 'LOW'
                    }
                  ]}
                  placeholder="Prioritas"
                  onChange={selectedOptions => {
                    onChange(selectedOptions.value)
                  }}
                />
              )}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="assignedToIds">Berika tugas</Label>
            <Controller
              name="assignedToIds"
              control={control}
              render={({ field: { onChange, ref } }) => (
                <MultipleSelect
                  inputRef={ref}
                  id="assignedToIds"
                  isLoading={isLoading || isPending}
                  options={data}
                  placeholder="Anggota"
                  onChange={selectedOptions => {
                    const values = selectedOptions
                      ? selectedOptions.map(option => option.value)
                      : []
                    onChange(values)
                  }}
                />
              )}
            />
          </div>
          <FormInput
            label="Tanggal Penugasan"
            error={errors.start}
            type="date"
            {...register('start')}
          />
          <FormInput
            label="Tanggal Berakhir"
            error={errors.end}
            type="date"
            {...register('end')}
          />
          <AlertDialogFooter className="col-span-2">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit">Bagikan Tugas</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const FormInput = ({ label, error, ...props }) => {
  const formId = useId()

  return (
    <div className="space-y-3">
      <Label htmlFor={formId}>{label}</Label>
      <Input id={formId} {...props} />
      {error ? (
        <p className="text-red-500 min-h-5 text-sm">{error.message}</p>
      ) : (
        <p className="min-h-5"></p>
      )}
    </div>
  )
}

export default CreatedTaskDialog
