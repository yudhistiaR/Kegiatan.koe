'use client'

import { useId } from 'react'
import { useParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { TaskSchema } from '@/schemas/frontend/task-schema'
import { Plus, Calendar, Users, AlertTriangle } from 'lucide-react'

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
      orgId: orgId,
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
      toast.success('Berhasil menambah tugas')
      queryClient.invalidateQueries(['org_mem', prokerId, divisiId, orgId])
      reset()
    },
    onError: () => {
      toast.error('Gagal menambah tugas')
      reset()
    }
  })

  const onSubmit = data => {
    mutation.mutate(data)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          className="text-white font-medium"
          style={{ backgroundColor: 'oklch(56.95% 0.165 266.79)' }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Tugas
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className="min-w-[900px] max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'oklch(29.46% 0.06 276.82)',
          borderColor: 'oklch(56.95% 0.165 266.79)'
        }}
      >
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-xl text-white flex items-center gap-2">
            <Plus
              className="h-5 w-5"
              style={{ color: 'oklch(56.95% 0.165 266.79)' }}
            />
            Tambahkan Tugas Baru
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/70">
            Buat tugas baru dan assign ke anggota tim untuk mengelola pekerjaan
            dengan lebih efektif.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 overflow-y-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormInputImproved
            label="Nama Tugas"
            placeholder="Masukkan nama tugas"
            error={errors.name}
            type="text"
            icon={<Calendar className="h-4 w-4" />}
            {...register('name')}
          />

          <div className="space-y-3">
            <Label
              htmlFor="priority"
              className="text-white flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Prioritas Tugas
            </Label>
            <Controller
              name="priority"
              control={control}
              render={({ field: { onChange, ref } }) => (
                <SingleSelect
                  inputRef={ref}
                  id="priority"
                  options={[
                    { label: 'HIGH - Prioritas Tinggi', value: 'HIGH' },
                    { label: 'MEDIUM - Prioritas Sedang', value: 'MEDIUM' },
                    { label: 'LOW - Prioritas Rendah', value: 'LOW' }
                  ]}
                  placeholder="Pilih prioritas tugas"
                  onChange={selectedOptions => {
                    onChange(selectedOptions.value)
                  }}
                />
              )}
            />
            {errors.priority && (
              <p className="text-red-400 text-sm">{errors.priority.message}</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-3">
            <Label htmlFor="description" className="text-white">
              Deskripsi Tugas
            </Label>
            <textarea
              id="description"
              maxLength={300}
              placeholder="Jelaskan detail tugas yang akan dikerjakan..."
              className="flex min-h-[100px] w-full rounded-lg border px-4 py-3 text-sm shadow-sm placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 text-white resize-none"
              style={{
                backgroundColor: 'oklch(27.27% 0.056 276.3)',
                borderColor: 'oklch(56.95% 0.165 266.79)',
                '--tw-ring-color': 'oklch(56.95% 0.165 266.79)'
              }}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-red-400 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="assignedToIds"
              className="text-white flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Assign ke Anggota
            </Label>
            <Controller
              name="assignedToIds"
              control={control}
              render={({ field: { onChange, ref } }) => (
                <MultipleSelect
                  inputRef={ref}
                  id="assignedToIds"
                  isLoading={isLoading || isPending}
                  options={data}
                  placeholder="Pilih anggota tim"
                  onChange={selectedOptions => {
                    const values = selectedOptions
                      ? selectedOptions.map(option => option.value)
                      : []
                    onChange(values)
                  }}
                />
              )}
            />
            {errors.assignedToIds && (
              <p className="text-red-400 text-sm">
                {errors.assignedToIds.message}
              </p>
            )}
          </div>

          <div className="space-y-6">
            <FormInputImproved
              label="Tanggal Mulai"
              error={errors.start}
              type="date"
              icon={<Calendar className="h-4 w-4" />}
              {...register('start')}
            />

            <FormInputImproved
              label="Tanggal Berakhir"
              error={errors.end}
              type="date"
              icon={<Calendar className="h-4 w-4" />}
              {...register('end')}
            />
          </div>

          <AlertDialogFooter className="md:col-span-2 flex gap-3 pt-6 border-t border-white/20">
            <AlertDialogCancel
              className="border-white/20 text-white hover:bg-white/10"
              disabled={mutation.isLoading}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type="submit"
                disabled={mutation.isLoading}
                className="text-white font-medium"
                style={{ backgroundColor: 'oklch(56.95% 0.165 266.79)' }}
              >
                {mutation.isLoading ? 'Membuat...' : 'Buat Tugas'}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const FormInputImproved = ({ label, error, icon, ...props }) => {
  const formId = useId()

  return (
    <div className="space-y-3">
      <Label htmlFor={formId} className="text-white flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Input
        id={formId}
        className="text-white placeholder:text-white/50 border-white/20 focus-visible:ring-2"
        style={{
          backgroundColor: 'oklch(27.27% 0.056 276.3)',
          borderColor: 'oklch(56.95% 0.165 266.79)',
          '--tw-ring-color': 'oklch(56.95% 0.165 266.79)'
        }}
        {...props}
      />
      {error && <p className="text-red-400 text-sm">{error.message}</p>}
    </div>
  )
}

export default CreatedTaskDialog
