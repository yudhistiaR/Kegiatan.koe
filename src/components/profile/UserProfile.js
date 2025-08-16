'use client'

import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { useAuth, useUser } from '@clerk/nextjs'
import Image from 'next/image'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PenLine } from 'lucide-react'
import { toast } from 'sonner'

const UserProfile = () => {
  const { userId } = useAuth()
  const { user } = useUser()

  const queryClient = useQueryClient()

  const {
    data: userProfile,
    isLoading,
    isPending
  } = useQuery({
    queryKey: ['me', userId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/clerk/user`)
      return res.json()
    }
  })

  const updateUserProfile = useMutation({
    mutationFn: async data => {
      const req = await fetch('/api/v1/clerk/user', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      return req.json()
    },
    onMutate: async newData => {
      await queryClient.cancelQueries({ queryKey: ['me', userId] })

      const previousData = queryClient.getQueryData(['me', userId])

      queryClient.setQueryData(['me', userId], newData)

      return { previousData }
    },
    onSuccess: () => {
      toast.success('Profile updated')
      queryClient.invalidateQueries({ queryKey: ['me', userId] })
    },
    onError: () => {
      toast.error('Profile not updated')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['me', userId] })
    }
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty }
  } = useForm({
    defaultValues: userProfile || {},
    values: userProfile
  })

  const onSubmit = data => {
    user.reload()
    updateUserProfile.mutate(data)
  }

  const handleCancel = () => {
    reset(userProfile)
  }

  return (
    <div>
      {!isLoading && !isPending ? (
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 items-center">
            <div className="rounded-md min-h-[150px] min-w-[150px] max-h-[200px] max-w-[200px] shadow-lg bg-zinc-400 flex items-center">
              <Image
                className="w-full h-full rounded-md"
                src={userProfile?.profileImg}
                alt="profile-mage"
                width={200}
                height={200}
              />
            </div>
          </div>
          <div className="flex-1">
            <form
              className="grid grid-cols-2 gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid gap-3">
                <Label>Nama</Label>
                <Input placeholder="Nama Lengkap" {...register('fullName')} />
              </div>
              <div className="grid gap-3">
                <Label>NPM/NIM</Label>
                <Input placeholder="nim/npm" {...register('npm')} />
              </div>
              <div className="grid gap-3">
                <Label>Asal Kampus</Label>
                <Input placeholder="Asal Kampus" {...register('universitas')} />
              </div>
              <div className="grid gap-3">
                <Label>No Telpon</Label>
                <Input
                  placeholder="No Telpon"
                  type="tlp"
                  {...register('telpon')}
                />
              </div>
              <div className="grid gap-3">
                <Label>Tanggal Lahir</Label>
                <Controller
                  name="tanggal_lahir"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="tanggal_lahir"
                      type="date"
                      value={field.value ? field.value.split('T')[0] : ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="grid gap-3">
                <Label>Jenis Kelamin</Label>
                <select
                  id="jenis_kelamin"
                  {...register('jenis_kelamin')}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="Laki-Laki">Laki-Laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="grid gap-3 col-span-2">
                <Label>Alamat</Label>
                <textarea
                  maxLength={200}
                  rows={2}
                  placeholder="Alamat"
                  {...register('alamat')}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>
              <div className="grid gap-3 col-span-2">
                <Label>Bio</Label>
                <textarea
                  maxLength={500}
                  rows={4}
                  placeholder="Bio"
                  {...register('bio')}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>
              {isDirty && (
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <Button
                    disabled={updateUserProfile.isPending}
                    variant="destructive"
                    onClick={handleCancel}
                  >
                    Batal
                  </Button>
                  <Button type="submit">
                    {updateUserProfile.isPending ? (
                      'Menyimpan...'
                    ) : (
                      <>
                        <PenLine /> Simpan
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default UserProfile
