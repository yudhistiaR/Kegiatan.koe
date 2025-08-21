'use client'

//Hooks
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'

//Components
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { SingleSelect } from '../ui/CustomeSelect'

//Schema
import { ProkerSchema } from '@/schemas/frontend/proker-schema'

export const ProkerForm = () => {
  const { orgId } = useAuth()
  const queryClient = useQueryClient()

  const flattenData = data => {
    const option = []

    data.map(itm =>
      option.push({
        value: itm.user.id,
        label: itm.user.fullName
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

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(ProkerSchema.CREATE),
    defaultValues: {
      title: '',
      orgId: orgId,
      ketuaPelaksanaId: '',
      description: '',
      start: '',
      end: ''
    }
  })

  const mutation = useMutation({
    mutationFn: async data => {
      const res = await fetch('/api/v1/proker', {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return res.json()
    },
    onSuccess: () => {
      toast.success('Berhasil menyimpan program kerja')
      reset()
      queryClient.invalidateQueries(['proker-list', orgId])
    },
    onError: error => {
      toast.error('Gagal menyimpan program kerja', error)
      reset()
      queryClient.invalidateQueries(['proker-list', orgId])
    }
  })

  const onSubmit = async data => {
    mutation.mutate(data)
  }

  return (
    <form
      className="flex flex-col gap-2 px-4 overflow-y-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput
        label="Nama Program Kerja"
        placeholder="Program Kerja"
        error={errors.title}
        type="text"
        {...register('title')}
      />
      <div className="space-y-3 mb-4">
        <Label htmlFor="ketuaPelaksanaId">Ketua Pelaksanaan</Label>
        <Controller
          name="ketuaPelaksanaId"
          control={control}
          render={({ field }) => (
            <SingleSelect
              id="ketuaPelaksanaId"
              isLoading={isLoading || isPending}
              options={data}
              placeholder="Pilih anggota"
              onChange={selected => {
                field.onChange(selected.value)
              }}
            />
          )}
        />
      </div>
      <div className="space-y-3 mb-4">
        <Label htmlFor="dec">Deskripsi</Label>
        <textarea
          id="dec"
          maxLength={300}
          placeholder="Deskripsi program kerja"
          className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-red-500 min-h-5 text-sm">
            {errors.description.message}
          </p>
        )}
      </div>
      <FormInput
        label="Tanggal Persiapan"
        error={errors.start}
        type="date"
        {...register('start')}
      />
      <FormInput
        label="Tanggal Pelaksanaan"
        error={errors.end}
        type="date"
        {...register('end')}
      />
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </form>
  )
}

const FormInput = ({ label, error, ...props }) => {
  const formId = useId()

  return (
    <div className="space-y-2">
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
