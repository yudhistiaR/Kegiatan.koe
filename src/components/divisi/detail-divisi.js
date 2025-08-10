'use client'

import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useMemo } from 'react'
import Image from 'next/image'
import { formatDate } from '@/helpers/formatedate'
import { Badge } from '@/components/ui/badge'
import { Link as LinkIcon, Users, UserPlus } from 'lucide-react'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Multipleselect from '../ui/CustomeSelect'
import { buttonVariants } from '../ui/button'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import { LoadingState, ErrorState } from '@/components/LoadState/LoadStatus'

import { Protect } from '@clerk/nextjs'

const columnHelper = createColumnHelper()

function DetailDivisi() {
  const { divisiId } = useParams()

  const columns = useMemo(
    () => [
      columnHelper.accessor(row => row.user.profileImg, {
        id: 'profileImg',
        header: 'Foto',
        cell: info => (
          <div className="flex justify-center">
            <Image
              src={info.getValue()}
              alt="foto"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
        )
      }),
      columnHelper.accessor(row => row.user.username, {
        id: 'username',
        header: 'Username',
        cell: info => (
          <div className="font-medium dark:text-gray-100">
            {info.getValue()}
          </div>
        )
      }),
      columnHelper.accessor(row => row.user.npm, {
        id: 'npm',
        header: 'NPM/NIM',
        cell: info => <div className="text-sm">{info.getValue()}</div>
      }),
      columnHelper.accessor(row => row.user.universitas, {
        id: 'universitas',
        header: 'Universitas',
        cell: info => <div className="text-sm">{info.getValue()}</div>
      }),
      columnHelper.accessor(row => row.user.telpon, {
        id: 'telpon',
        header: 'Kontak',
        cell: info => {
          const encodeURL = encodeURI(
            `https://wa.me/62${info.getValue().substring(1, info.getValue().length)}?text=Halo kak, saya ingin bertanya tentang proker`
          )

          return (
            <Link
              target="_blank"
              href={encodeURL}
              className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 rounded-md transition-colors duration-200 text-sm"
            >
              <LinkIcon size={14} />
              <span className="hidden sm:inline">{info.getValue()}</span>
              <span className="sm:hidden">WhatsApp</span>
            </Link>
          )
        }
      }),
      columnHelper.accessor(row => row.user.jenis_kelamin, {
        id: 'jenis_kelamin',
        header: 'Gender',
        cell: info => (
          <Badge variant="outline" className="text-xs text-white">
            {info.getValue()}
          </Badge>
        )
      }),
      columnHelper.accessor(row => row.created_at, {
        id: 'created_at',
        header: 'Bergabung',
        cell: info => (
          <div className="text-sm">{formatDate(info.getValue())}</div>
        )
      }),
      columnHelper.accessor('jenis_jabatan', {
        header: 'Jabatan',
        cell: info => (
          <Badge
            variant={
              info.getValue() === 'KORDINATOR' ? 'destructive' : 'secondary'
            }
            className="font-medium"
          >
            {info.getValue()}
          </Badge>
        )
      })
    ],
    []
  )

  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ['detail-divisi', divisiId],
    queryFn: async () => {
      const req = await fetch(`/api/v1/proker/divisi/${divisiId}`)
      return req.json()
    },
    enabled: !!divisiId
  })

  const anggotaDivisi = useMemo(() => {
    if (data && data[0] && data[0].anggota) {
      return data[0].anggota
    }
    return []
  }, [data])

  const table = useReactTable({
    data: anggotaDivisi,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  if (isLoading || isPending) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header Section */}
      {data?.map(divisi => (
        <Card key={divisi.id} className="shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold dark:text-gray-100">
                  {divisi.name}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed max-w-2xl">
                  {divisi.description}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button>
                      <Users size={16} />
                      <span className="font-semibold">
                        {divisi.anggota.length}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total anggota divisi</p>
                  </TooltipContent>
                </Tooltip>
                <Protect permission="divisi:edit">
                  <TambahAnggota divisiId={divisi.id} />
                </Protect>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}

      {/* Members Table Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Users size={24} />
            Daftar Anggota
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="border-b">
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map(row => (
                    <tr
                      key={row.id}
                      className={`hover:bg-accentColor/80 transition-colors duration-150`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-4 py-4 whitespace-nowrap text-center"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-12 text-center"
                    >
                      <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
                        <Users size={48} className="opacity-50" />
                        <div>
                          <p className="font-medium">Belum ada anggota</p>
                          <p className="text-sm">
                            Tambahkan anggota untuk mulai berkolaborasi
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const TambahAnggota = ({ divisiId }) => {
  const { orgId } = useAuth()
  const queryClient = useQueryClient()

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      divisi_id: divisiId,
      members: []
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
    queryKey: ['org_mem', orgId, divisiId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/organisasi/${orgId}/member`)
      return res.json()
    },
    select: data => flattenData(data),
    enabled: !!(orgId || divisiId)
  })

  const mutation = useMutation({
    mutationFn: async data => {
      const res = await fetch(`/api/v1/proker/divisi/${divisiId}`, {
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
      toast.success('Berhasil menambah anggota')
      queryClient.invalidateQueries(['detail-divisi', divisiId])
      queryClient.invalidateQueries(['org_mem', orgId])
      reset()
    },
    onError: error => {
      toast.error(`Gagal menambah anggota: ${error.message}`)
      reset()
    }
  })

  const onSubmit = data => {
    mutation.mutate(data)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={buttonVariants({
          size: 'sm',
          className: 'shadow-sm hover:shadow-md transition-shadow duration-200'
        })}
      >
        <UserPlus size={16} className="mr-2" />
        Tambah Anggota
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <UserPlus size={20} />
            Tambah Anggota Divisi
          </AlertDialogTitle>
          <AlertDialogDescription>
            Pilih anggota organisasi yang akan bertugas di divisi ini. Anda
            dapat memilih beberapa anggota sekaligus.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="members"
            control={control}
            render={({ field: { onChange, ref } }) => (
              <Multipleselect
                inputRef={ref}
                id="members"
                isMulti={true}
                isLoading={isLoading || isPending}
                options={data}
                placeholder="Pilih anggota..."
                onChange={selectedOptions => {
                  const values = selectedOptions
                    ? selectedOptions.map(option => option.value)
                    : []
                  onChange(values)
                }}
                className="w-full"
              />
            )}
          />

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              disabled={mutation.isPending}
              className="min-w-24"
            >
              {mutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Menambah...</span>
                </div>
              ) : (
                'Tambah Anggota'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DetailDivisi
