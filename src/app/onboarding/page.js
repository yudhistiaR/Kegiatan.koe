'use client'

import { useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PenLine, ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { completeOnboarding } from '@/action/_action'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const OnBoardingPage = () => {
  const { user } = useUser()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const queryClient = useQueryClient()

  const onboardingSteps = [
    {
      id: 1,
      name: 'Informasi Dasar',
      description:
        'Mari kenal lebih dekat dengan Anda. Isi informasi dasar Anda.',
      percent: 50,
      fields: [
        'username',
        'npm',
        'universitas',
        'telpon',
        'tanggal_lahir',
        'jenis_kelamin'
      ]
    },
    {
      id: 2,
      name: 'Informasi Tambahan',
      description: 'Lengkapi profil Anda dengan detail tambahan.',
      percent: 100,
      fields: ['alamat', 'bio']
    }
  ]

  const updateUserProfile = useMutation({
    mutationFn: async data => {
      const req = await fetch('/api/v1/me', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      return req.json()
    },
    onMutate: async newData => {
      await queryClient.cancelQueries({ queryKey: ['me', user?.id] })

      const previousData = queryClient.getQueryData(['me', user?.id])

      queryClient.setQueryData(['me', user.id], newData)

      return { previousData }
    },
    onSuccess: () => {
      toast.success('Profile updated')
      queryClient.invalidateQueries({ queryKey: ['me', user?.id] })
    },
    onError: () => {
      toast.error('Profile not updated')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['me', user?.id] })
    }
  })

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      username: '',
      npm: '',
      universitas: '',
      telpon: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
      alamat: '',
      bio: ''
    }
  })

  const nextStep = async () => {
    const currentStepFields = onboardingSteps[currentStep].fields
    const isValid = await trigger(currentStepFields)

    if (isValid && currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      toast.success('Langkah berhasil!', {
        description: `Melanjutkan ke ${onboardingSteps[currentStep + 1].name}.`
      })
    } else if (!isValid) {
      toast.error(
        'Harap lengkapi semua bidang yang diperlukan sebelum melanjutkan.'
      )
    }
  }

  // Fungsi untuk pindah ke langkah sebelumnya
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async data => {
    if (currentStep === onboardingSteps.length - 1) {
      const res = await completeOnboarding(data)
      if (res?.message) {
        await user?.reload()
        updateUserProfile.mutate(data)
        router.push('/dashboard')
      }
    } else {
      nextStep()
    }
  }

  const currentStepData = onboardingSteps[currentStep]

  return (
    <div className="flex flex-col md:flex-row w-full h-screen p-4 md:p-5 rounded-lg shadow-md">
      {/* Bagian Kiri: Informasi Langkah dan Formulir */}
      <div className="flex-1 p-2 md:p-8 rounded-lg shadow-md">
        <div>
          <Image
            src="/main_logo.png"
            width={160}
            height={160}
            alt="Kegiatan.koe"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl space-y-6 mt-8 h-full">
            {/* Header Langkah */}
            <div className="text-center">
              <h1 className="text-2xl font-bold">{currentStepData.name}</h1>
              <p className="text-md text-gray-500 mt-2">
                {currentStepData.description}
              </p>
              <div className="w-full rounded-full h-2.5 mt-4">
                <div
                  className="bg-accentColor h-2.5 rounded-full"
                  style={{ width: `${currentStepData.percent}%` }}
                ></div>
              </div>
            </div>

            {/* Formulir */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6 rounded-lg shadow-inner"
            >
              {/* Render bidang berdasarkan langkah saat ini */}
              {currentStep === 0 && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Masukkan username Anda"
                      {...register('username', {
                        required: 'Username wajib diisi'
                      })}
                    />
                    {errors.username && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="npm">NPM/NIM</Label>
                    <Input
                      id="npm"
                      placeholder="Masukkan NPM/NIM Anda"
                      {...register('npm', { required: 'NPM/NIM wajib diisi' })}
                    />
                    {errors.npm && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.npm.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="universitas">Asal Kampus</Label>
                    <Input
                      id="universitas"
                      placeholder="Masukkan asal kampus Anda"
                      {...register('universitas', {
                        required: 'Asal kampus wajib diisi'
                      })}
                    />
                    {errors.universitas && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.universitas.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="telpon">No. Telepon</Label>
                    <Input
                      id="telpon"
                      placeholder="Masukkan nomor telepon Anda"
                      type="tel"
                      {...register('telpon', {
                        required: 'Nomor telepon wajib diisi',
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'Nomor telepon hanya boleh berisi angka'
                        }
                      })}
                    />
                    {errors.telpon && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.telpon.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                    <Controller
                      name="tanggal_lahir"
                      control={control}
                      rules={{ required: 'Tanggal lahir wajib diisi' }}
                      render={({ field }) => (
                        <Input
                          id="tanggal_lahir"
                          type="date"
                          value={field.value ? field.value.split('T')[0] : ''}
                          onChange={field.onChange}
                          className="w-full rounded-md border border-input px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                      )}
                    />
                    {errors.tanggal_lahir && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.tanggal_lahir.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                    <select
                      id="jenis_kelamin"
                      {...register('jenis_kelamin', {
                        required: 'Jenis kelamin wajib diisi'
                      })}
                      className="w-full rounded-md border border-input px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="Laki-Laki">Laki-Laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    {errors.jenis_kelamin && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.jenis_kelamin.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div className="grid gap-2 col-span-1 md:col-span-2">
                    <Label htmlFor="alamat">Alamat</Label>
                    <textarea
                      id="alamat"
                      maxLength={200}
                      rows={3} // Menyesuaikan tinggi textarea
                      placeholder="Masukkan alamat lengkap Anda"
                      {...register('alamat', {
                        required: 'Alamat wajib diisi'
                      })}
                      className="w-full rounded-md border border-input px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                    {errors.alamat && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.alamat.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2 col-span-1 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      maxLength={500}
                      rows={5} // Menyesuaikan tinggi textarea
                      placeholder="Ceritakan sedikit tentang diri Anda"
                      {...register('bio')}
                      className="w-full rounded-md border border-input px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                    {errors.bio && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.bio.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Tombol Navigasi dan Aksi */}
              <div className="col-span-1 md:col-span-2 flex justify-between items-center mt-6">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft size={18} /> Kembali
                  </Button>
                )}
                <div className="flex-grow"></div> {/* Spacer */}
                {currentStep < onboardingSteps.length - 1 ? (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    Selanjutnya <ArrowRight size={18} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {updateUserProfile.isPending ? (
                      'Menyimpan...'
                    ) : (
                      <>
                        <PenLine size={18} /> Selesai
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bagian Kanan: Visual (Contoh) */}
      <div className="hidden md:flex flex-1 items-center justify-center p-4 md:p-8 bg-accentColor rounded-lg ml-4">
        <div className="text-white">
          <h2 className="text-3xl font-extrabold mb-4 group">
            Selamat datang di{' '}
            <span className="group-hover:bg-background p-2 transition-colors duration-200">
              Kegiatan
              <span className="group-hover:text-accentColor transition-colors duration-700">
                .koe
              </span>
            </span>
          </h2>
          <p className="text-lg">
            Ini adalah tempat di mana kamu bisa mengelola setiap kegiatan dan
            keuangan organisasi mahasiswa dengan lebih mudah dan terstruktur
          </p>
          <p className="text-lg mt-2 text-zinc-300">
            Lengkapi profil Anda untuk memulai perjalanan Anda.
          </p>
          {/* Anda bisa menambahkan ilustrasi atau animasi di sini */}
        </div>
      </div>
    </div>
  )
}

export default OnBoardingPage
