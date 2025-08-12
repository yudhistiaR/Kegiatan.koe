'use client'

import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { EyeIcon, Trash2, Users, Clock } from 'lucide-react'
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
import {
  LoadingState,
  ErrorState,
  NotDataState
} from '@/components/LoadState/LoadStatus'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { useAuth } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { formatDate } from '@/helpers/formatedate'
import { buttonVariants } from '@/components/ui/button'
import { toast } from 'sonner'
import { Protect } from '@clerk/nextjs'

const CardListDivisi = () => {
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
    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 items-center mt-4">
      {data.map((divisi, _) => (
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
              <Protect permission="divisi:delete">
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
              </Protect>
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

export default CardListDivisi
