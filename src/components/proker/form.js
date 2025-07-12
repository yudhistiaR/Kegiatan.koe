'use client'

//Hooks
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useUser, useAuth, useOrganization } from '@clerk/nextjs'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

//Components
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import MultipleSelect from '../ui/CustomeSelect'

//Schema
import { ProkerSchema } from '@/schemas/frontend/proker-schema'
import { DivisiSchema } from '@/schemas/frontend/divisi-schema'

export const ProkerForm = () => {
  const { user } = useUser()
  const { organization } = useOrganization()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(ProkerSchema.CREATE),
    defaultValues: {
      title: '',
      org_id: organization.id,
      author: user.fullName,
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
      queryClient.invalidateQueries(['proker-list', user?.id, organization?.id])
    },
    onError: () => {
      toast.error('Gagal menyimpan program kerja')
      reset()
    }
  })

  const onSubmit = async data => {
    mutation.mutate(data)
  }

  return (
    <form
      className="flex flex-col gap-2 px-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput
        label="Nama Program Kerja"
        placeholder="Program Kerja"
        error={errors.title}
        type="text"
        {...register('title')}
      />
      <div className="space-y-3">
        <Label htmlFor="dec">Deskripsi</Label>
        <textarea
          id="dec"
          maxLength={300}
          placeholder="Deskripsi program kerja"
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

export const DivisiForm = () => {
  const { orgId } = useAuth()
  const { prokerId } = useParams()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(DivisiSchema.CREATE),
    defaultValues: {
      proker_id: prokerId,
      org_id: orgId,
      user_id: '',
      name: '',
      description: ''
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
    queryKey: ['org_mem', orgId, prokerId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/organisasi/${orgId}/member`)
      return res.json()
    },
    select: data => flattenData(data)
  })

  const mutation = useMutation({
    mutationFn: async data => {
      const res = await fetch(`/api/v1/proker/${orgId}/${prokerId}/divisi`, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return res.json()
    },
    onSuccess: () => {
      toast.success('Berhasi membuat divisi')
      queryClient.invalidateQueries(['proker-divisi', orgId, prokerId])
      reset()
    },
    onError: () => {
      toast.error('Gagal membuat divisi')
      reset()
    }
  })

  const onSubmit = async data => {
    mutation.mutate(data)
  }

  return (
    <form
      className="flex flex-col gap-4 px-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput
        label="Nama Divisi"
        placeholder="nama divisi"
        error={errors.name}
        type="text"
        {...register('name')}
      />
      <div className="space-y-3">
        <Label htmlFor="user_id">Kordinator Divisi</Label>
        <Controller
          name="user_id"
          control={control}
          render={({ field }) => (
            <MultipleSelect
              id="user_id"
              isLoading={isLoading && isPending}
              options={data}
              placeholder="Pilih anggota"
              onChange={selected => {
                field.onChange(selected.value)
              }}
            />
          )}
        />
        {errors.user_id ? (
          <p className="text-red-500 min-h-5 text-sm">
            {errors.description.message}
          </p>
        ) : (
          <p className="min-h-5"></p>
        )}
      </div>
      <div className="space-y-3">
        <Label htmlFor="dec">Deskripsi</Label>
        <textarea
          id="dec"
          maxLength={300}
          placeholder="Deskripsi program kerja"
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
