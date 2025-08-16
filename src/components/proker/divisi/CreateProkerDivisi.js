'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { toast } from 'sonner'
import { SingleSelect } from '@/components/ui/CustomeSelect'

import { useId } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { DivisiSchema } from '@/schemas/frontend/divisi-schema'

const CreateProkerDivisi = () => {
  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ size: 'sm' })}>
        + Buat
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tambahkan Divisi Program Kerja</SheetTitle>
          <SheetDescription>
            Menambah divisi di program kerja, klik simpan untuk menyimpan
          </SheetDescription>
        </SheetHeader>
        <DivisiForm />
      </SheetContent>
    </Sheet>
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

const DivisiForm = () => {
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
      prokerId: prokerId,
      orgId: orgId,
      kordinatorId: '',
      name: '',
      description: ''
    }
  })

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
        <Label htmlFor="kordinatorId">Kordinator Divisi</Label>
        <Controller
          name="kordinatorId"
          control={control}
          render={({ field }) => (
            <SingleSelect
              id="kordinatorId"
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
          <p className="text-red-500 min-h-5 text-sm">{errors.description}</p>
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
          <p className="text-red-500 min-h-5 text-sm">{errors.description}</p>
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

export default CreateProkerDivisi
