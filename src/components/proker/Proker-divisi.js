'use client'

// Hooks
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

//helpers
import { formatDate } from '@/helpers/formatedate'

//Components
import { EyeIcon, Trash2, Users, Clock } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { DivisiForm } from '@/components/proker/form'
import Link from 'next/link'
import {
  LoadingState,
  ErrorState,
  NotDataState
} from '@/components/LoadState/LoadStatus'

const ProkerDivisi = () => {
  const { prokerId } = useParams()
  const { orgId: org_id, orgSlug } = useAuth()

  const queryClient = useQueryClient()

  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ['proker-divisi', org_id, prokerId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/proker/${org_id}/${prokerId}/divisi`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      return res.json()
    }
  })
  const mutation = useMutation({
    mutationFn: async divisi_id => {
      return await fetch(
        `/api/v1/proker/${org_id}/${prokerId}/divisi?id=${divisi_id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    },
    onSuccess: () => {
      toast.success('Berhasil menghapus divisi')
      queryClient.invalidateQueries(['proker-divisi', org_id, prokerId])
    },
    onError: () => {
      toast.error('Gagal mengapus divisi')
      queryClient.invalidateQueries(['proker-divisi', org_id, prokerId])
    }
  })

  const handleDelete = divisi_id => {
    mutation.mutate(divisi_id)
  }

  if (isLoading && isPending) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  if (!data) {
    return <NotDataState />
  }

  return (
    <div className="space-y-5">
      <nav className="w-full h-12 bg-background shadow-md flex items-center justify-end p-4 rounded-md">
        <DivisiSheetForm />
      </nav>
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {data?.map((divisi, _) => (
          <Card key={divisi.id} className="w-full min-h-70">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <p>{divisi.name}</p>
                <CardTooltip
                  comp={
                    <p className="text-sm flex items-center gap-1">
                      <Users size={15} /> {divisi.anggota?.length}
                    </p>
                  }
                  label="Jumlah anggota divisi"
                />
              </CardTitle>
              <CardDescription>
                Kordinator :{' '}
                {divisi.anggota.map(detail => {
                  if (detail.jenis_jabatan === 'KORDINATOR')
                    return detail.user.username
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-justify">{divisi.description}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <CardTooltip
                comp={
                  <p className="text-sm flex items-center gap-1">
                    <Clock size={15} /> {formatDate(divisi.created_at)}
                  </p>
                }
                label="Tanggal Pembuata Divisi"
              />
              <div className="flex items-center gap-2">
                <AlertDialog>
                  <CardTooltip
                    comp={
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive">
                          <Trash2 />
                        </Button>
                      </AlertDialogTrigger>
                    }
                    label="Hapus"
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah anda yakin ingin menghapus {divisi.name} ? data
                        yang dihapus tidak bisa di kembalikan!!!
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(divisi.id)}
                        className={buttonVariants({
                          variant: 'destructive'
                        })}
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <CardTooltip
                  className={buttonVariants({ size: 'icon' })}
                  comp={
                    <Link
                      href={`/${orgSlug}/detail/${divisi.id}/${prokerId}`}
                      className={buttonVariants()}
                      size="icon"
                    >
                      <EyeIcon />
                    </Link>
                  }
                  label="Detail"
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

const CardTooltip = ({ comp, label }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{comp}</TooltipTrigger>
      <TooltipContent className="shadow-lg">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

const DivisiSheetForm = () => {
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

export default ProkerDivisi
