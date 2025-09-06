'use client'

import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { useAuth, useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  PenLine,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Save,
  X,
  Loader2,
  CheckCircle,
  VenusAndMars,
  Hash,
  Megaphone
} from 'lucide-react'
import { toast } from 'sonner'
import { ErrorState, LoadingState } from '../LoadState/LoadStatus'

const userProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(50, 'Nama lengkap maksimal 50 karakter'),
  npm: z
    .string()
    .min(1, 'NPM/NIM wajib diisi')
    .regex(/^[0-9]+$/, 'NPM/NIM hanya boleh berisi angka'),
  universitas: z.string().optional().nullable().or(z.literal('')),
  telpon: z.string().optional().nullable().or(z.literal('')),
  tanggal_lahir: z.string().optional().nullable().or(z.literal('')),
  jenis_kelamin: z.string().optional().nullable().or(z.literal('')),
  alamat: z
    .string()
    .max(200, 'Alamat maksimal 200 karakter')
    .optional()
    .nullable()
    .or(z.literal('')),
  bio: z
    .string()
    .max(500, 'Bio maksimal 500 karakter')
    .optional()
    .nullable()
    .or(z.literal('')),
  profileImg: z.string().optional().nullable(),
  email: z
    .string()
    .email('Email tidak valid')
    .optional()
    .nullable()
    .or(z.literal(''))
})

const UserProfileEnhanced = () => {
  const { userId } = useAuth()
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()

  const {
    data: userProfile,
    isLoading,
    isPending,
    error
  } = useQuery({
    queryKey: ['me', userId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/clerk/user`)
      if (!res.ok) throw new Error('Failed to fetch profile')
      return res.json()
    }
  })

  const updateUserProfile = useMutation({
    mutationFn: async data => {
      const req = await fetch('/api/v1/clerk/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (!req.ok) throw new Error('Failed to update profile')
      return req.json()
    },
    onSuccess: () => {
      toast.success('Profil berhasil diperbarui!', {
        description: 'Perubahan telah disimpan ke sistem.'
      })
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['me', userId] })
    },
    onError: error => {
      toast.error('Gagal memperbarui profil', {
        description: `Terjadi kesalahan saat menyimpan data: ${error.message}`
      })
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
    formState: { isDirty, errors, isValid },
    watch
  } = useForm({
    resolver: zodResolver(userProfileSchema),
    values: userProfile || {},
    mode: 'onTouched'
  })

  const alamatValue = watch('alamat', userProfile?.alamat || '')
  const bioValue = watch('bio', userProfile?.bio || '')

  const onSubmit = data => {
    user?.reload()
    updateUserProfile.mutate(data)
  }

  const handleCancel = () => {
    reset(userProfile)
    setIsEditing(false)
  }

  const handleEdit = () => {
    reset(userProfile)
    setIsEditing(true)
  }

  // Loading skeleton
  if (isLoading || isPending) {
    return <LoadingState />
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <Card className="border-accentColor/50 bg-background">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-accentColor">
                  <AvatarImage
                    src={userProfile?.profileImg || '/placeholder.svg'}
                    alt={userProfile?.fullName || 'Profile'}
                  />
                  <AvatarFallback className="bg-accentColor text-white text-xl font-semibold">
                    {userProfile?.fullName}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-2">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {userProfile?.fullName || 'Nama Belum Diisi'}
                  </h1>
                  <p className="text-gray-300">
                    {userProfile?.npm || 'NPM/NIM belum diisi'}
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  {userProfile?.universitas && (
                    <div className="flex items-center space-x-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>{userProfile.universitas}</span>
                    </div>
                  )}
                  {userProfile?.email && (
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{userProfile.email}</span>
                    </div>
                  )}
                </div>
                {userProfile?.bio && (
                  <p className="text-gray-300 text-sm max-w-md">
                    {userProfile.bio}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button
                  onClick={handleEdit}
                  className="bg-accentColor hover:bg-accentColor/60 text-white"
                >
                  <PenLine className="w-4 h-4 mr-2" />
                  Edit Profil
                </Button>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  Mode Edit
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Form Card */}
      <Card className="border-accentColor/50 bg-background">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Informasi Pribadi</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Kelola informasi pribadi dan kontak Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-white flex items-center space-x-1"
                >
                  <User className="w-4 h-4" />
                  <span>Nama Lengkap</span>
                  <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Masukkan nama lengkap"
                  disabled={!isEditing}
                  className={`bg-[#25294a] border-[#3d4166] text-white placeholder:text-gray-400 ${
                    !isEditing ? 'opacity-60' : ''
                  } ${errors.fullName ? 'border-red-500' : ''}`}
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className="text-red-400 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* NPM/NIM */}
              <div className="space-y-2">
                <Label htmlFor="npm" className="text-white">
                  <Hash className="w-4 h-4" />
                  <span>NPM/NIM</span>
                  <span className="text-red-400 ml-1">*</span>
                </Label>
                <Input
                  id="npm"
                  placeholder="Masukkan NPM/NIM"
                  disabled={!isEditing}
                  className={`bg-[#25294a] border-[#3d4166] text-white placeholder:text-gray-400 ${
                    !isEditing ? 'opacity-60' : ''
                  } ${errors.npm ? 'border-red-500' : ''}`}
                  {...register('npm')}
                />
                {errors.npm && (
                  <p className="text-red-400 text-sm">{errors.npm.message}</p>
                )}
              </div>

              {/* Asal Kampus */}
              <div className="space-y-2">
                <Label
                  htmlFor="universitas"
                  className="text-white flex items-center space-x-1"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Asal Kampus</span>
                </Label>
                <Input
                  id="universitas"
                  placeholder="Masukkan nama universitas"
                  disabled={!isEditing}
                  className={`bg-[#25294a] border-[#3d4166] text-white placeholder:text-gray-400 ${
                    !isEditing ? 'opacity-60' : ''
                  }`}
                  {...register('universitas')}
                />
              </div>

              {/* No Telpon */}
              <div className="space-y-2">
                <Label
                  htmlFor="telpon"
                  className="text-white flex items-center space-x-1"
                >
                  <Phone className="w-4 h-4" />
                  <span>No Telepon</span>
                </Label>
                <Input
                  id="telpon"
                  placeholder="Masukkan nomor telepon"
                  type="tel"
                  disabled={!isEditing}
                  className={`bg-[#25294a] border-[#3d4166] text-white placeholder:text-gray-400 ${
                    !isEditing ? 'opacity-60' : ''
                  } ${errors.telpon ? 'border-red-500' : ''}`}
                  {...register('telpon')}
                />
                {errors.telpon && (
                  <p className="text-red-400 text-sm">
                    {errors.telpon.message}
                  </p>
                )}
              </div>

              {/* Tanggal Lahir */}
              <div className="space-y-2">
                <Label
                  htmlFor="tanggal_lahir"
                  className="text-white flex items-center space-x-1"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Tanggal Lahir</span>
                </Label>
                <Controller
                  name="tanggal_lahir"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="tanggal_lahir"
                      type="date"
                      disabled={!isEditing}
                      className={`bg-[#25294a] border-[#3d4166] text-white ${!isEditing ? 'opacity-60' : ''}`}
                      value={field.value ? field.value.split('T')[0] : ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-2">
                <Label htmlFor="jenis_kelamin" className="text-white">
                  <VenusAndMars className="w-4 h-4" />
                  <span>Jenis Kelamin</span>
                </Label>
                {isEditing ? (
                  <Controller
                    name="jenis_kelamin"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-background border-foreground text-white w-full">
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Laki-Laki">Laki-Laki</SelectItem>
                          <SelectItem value="Perempuan">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <div className="h-10 px-3 py-2 bg-[#25294a] border border-[#3d4166] rounded-md flex items-center text-white opacity-60">
                    {userProfile?.jenis_kelamin || 'Belum diisi'}
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-[#3d4166]" />

            {/* Alamat */}
            <div className="space-y-2">
              <Label
                htmlFor="alamat"
                className="text-white flex items-center space-x-1"
              >
                <MapPin className="w-4 h-4" />
                <span>Alamat</span>
              </Label>
              <Textarea
                id="alamat"
                placeholder="Masukkan alamat lengkap"
                maxLength={200}
                rows={3}
                disabled={!isEditing}
                className={`bg-[#25294a] border-[#3d4166] text-white placeholder:text-gray-400 resize-none ${
                  !isEditing ? 'opacity-60' : ''
                } ${errors.alamat ? 'border-red-500' : ''}`}
                {...register('alamat')}
              />
              <div className="text-right text-xs text-gray-400">
                {alamatValue?.length || 0}/200 karakter
              </div>
              {errors.alamat && (
                <p className="text-red-400 text-sm">{errors.alamat.message}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">
                <Megaphone className="w-4 h-4" />
                <span>Bio</span>
              </Label>
              <Textarea
                id="bio"
                placeholder="Ceritakan sedikit tentang diri Anda"
                maxLength={200}
                rows={4}
                disabled={!isEditing}
                className={`bg-[#25294a] border-[#3d4166] text-white placeholder:text-gray-400 resize-none ${
                  !isEditing ? 'opacity-60' : ''
                } ${errors.bio ? 'border-red-500' : ''}`}
                {...register('bio')}
              />
              <div className="text-right text-xs text-gray-400">
                {bioValue?.length || 0}/200 karakter
              </div>
              {errors.bio && (
                <p className="text-red-400 text-sm">{errors.bio.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#3d4166]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateUserProfile.isPending}
                  className="border-[#3d4166] text-gray-300 hover:bg-[#3d4166] hover:text-white bg-transparent"
                >
                  <X className="w-4 h-4 mr-2" />
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={updateUserProfile.isPending || !isDirty || !isValid}
                  className="bg-[#4b6fd7] hover:bg-[#3d5bc7] text-white"
                >
                  {updateUserProfile.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
            )}
          </form>
        </CardContent>
      </Card>

      {/* Success Indicator */}
      {!isEditing && !updateUserProfile.isPending && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>Profil Anda sudah lengkap dan tersimpan dengan aman.</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default UserProfileEnhanced
