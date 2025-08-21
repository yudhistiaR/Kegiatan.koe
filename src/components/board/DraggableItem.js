'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useParams } from 'next/navigation'
import { Calendar, Clock, Users, Trash2, AlertCircle } from 'lucide-react'

//Components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
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
import { AvatarStack } from '../ui/AvatarStack'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

function DraggableItem({ id, data, disabled }) {
  const queryClient = useQueryClient()
  const { divisiId } = useParams()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id,
    data: {
      type: 'task',
      item: { id: data.id, divisiId: data.divisiId }
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto'
  }

  const mutation = useMutation({
    mutationFn: async id => {
      const response = await fetch(`/api/v1/proker/divisi/${divisiId}/tugas`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(id)
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }
    },
    onSuccess: () => {
      toast.success('Tugas Berhasil dihapus')
      queryClient.invalidateQueries(['tugas'])
    },
    onError: () => {
      toast.error('Gagal menghapus tugas')
      queryClient.invalidateQueries(['tugas'])
    }
  })

  const handleDelete = () => {
    mutation.mutate({ id: data.id })
  }

  const getPriorityColor = priority => {
    const colors = {
      HIGH: 'oklch(65% 0.15 0)',
      MEDIUM: 'oklch(65% 0.15 45)',
      LOW: 'oklch(65% 0.15 140)'
    }
    return colors[priority] || 'oklch(56.95% 0.165 266.79)'
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const isOverdue = () => {
    const today = new Date()
    const endDate = new Date(data.end)
    return endDate < today && data.status !== 'DONE'
  }

  return (
    <Sheet>
      <SheetTrigger
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        asChild
      >
        <Card
          className={`cursor-grab rounded-lg border transition-all duration-200 hover:shadow-lg group ${
            isDragging && 'opacity-50 ring-2 scale-105'
          } ${isOverdue() ? 'ring-1' : 'border-white/10'}`}
          style={{
            backgroundColor: 'oklch(27.27% 0.056 276.3)',
            ...(isDragging && {
              ringColor: 'oklch(56.95% 0.165 266.79)',
              boxShadow: '0 0 20px oklch(56.95% 0.165 266.79 / 0.3)'
            }),
            ...(isOverdue() && {
              ringColor: 'oklch(65% 0.15 0)'
            })
          }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-between items-start gap-2">
              <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-white/90">
                {data.name}
              </h3>
              <div className="flex flex-col gap-1">
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: getPriorityColor(data.priority) }}
                >
                  {data.priority}
                </span>
                {isOverdue() && (
                  <div
                    className="flex items-center gap-1 text-xs"
                    style={{ color: 'oklch(65% 0.15 0)' }}
                  >
                    <AlertCircle className="h-3 w-3" />
                    <span>Terlambat</span>
                  </div>
                )}
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="py-0 space-y-3">
            <p className="text-sm text-white/70 line-clamp-2">
              {data.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(data.start)}</span>
                <span>-</span>
                <span>{formatDate(data.end)}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/60">
                <Users className="h-3 w-3" />
                <span>{data.assignedTo.length} anggota</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-3">
            <div className="flex justify-between items-center w-full">
              <AvatarStack
                avatars={data.assignedTo.map(assigned => assigned.user)}
                maxAvatarsAmount={3}
                spacing="sm"
              />
              <div className="text-xs px-2 py-1 rounded-full border border-white/20 text-white/60">
                {data.divisi.name}
              </div>
            </div>
          </CardFooter>
        </Card>
      </SheetTrigger>

      <SheetContent
        className="min-w-[400px] sm:max-w-[500px] overflow-y-auto"
        style={{
          backgroundColor: 'oklch(29.46% 0.06 276.82)',
          borderColor: 'oklch(56.95% 0.165 266.79)'
        }}
      >
        <SheetHeader className="p-0 mt-6 space-y-4">
          <SheetTitle
            className="font-bold flex justify-between items-start gap-4"
            asChild
          >
            <div>
              <h1 className="text-xl text-white">{data.name}</h1>
              <div className="flex flex-col gap-2">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium text-white w-fit"
                  style={{ backgroundColor: getPriorityColor(data.priority) }}
                >
                  {data.priority}
                </span>
                {isOverdue() && (
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: 'oklch(65% 0.15 0)' }}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>Tugas Terlambat</span>
                  </div>
                )}
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="grid gap-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/70">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Mulai</span>
              </div>
              <p className="text-white">{formatDate(data.start)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/70">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Berakhir</span>
              </div>
              <p className="text-white">{formatDate(data.end)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/70">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Status</span>
            </div>
            <div
              className="px-3 py-2 rounded-lg border border-white/20 text-white w-fit"
              style={{ backgroundColor: 'oklch(27.27% 0.056 276.3)' }}
            >
              {data.status}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-white/70">Divisi</p>
            <div
              className="px-3 py-2 rounded-lg border border-white/20"
              style={{ backgroundColor: 'oklch(27.27% 0.056 276.3)' }}
            >
              <span className="font-semibold text-white">
                {data.divisi.name}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/70">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">
                Ditugaskan Kepada ({data.assignedTo.length})
              </span>
            </div>
            <AvatarStack
              maxAvatarsAmount={10}
              spacing="md"
              avatars={data.assignedTo.map(assigned => assigned.user)}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-white/70">Deskripsi</p>
            <div
              className="p-4 rounded-lg border border-white/20"
              style={{ backgroundColor: 'oklch(27.27% 0.056 276.3)' }}
            >
              <p className="text-white text-sm leading-relaxed">
                {data.description}
              </p>
            </div>
          </div>
        </div>

        {!disabled && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {mutation.isLoading ? 'Menghapus...' : 'Hapus Tugas'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                className="z-[999]"
                style={{
                  backgroundColor: 'oklch(29.46% 0.06 276.82)',
                  borderColor: 'oklch(56.95% 0.165 266.79)'
                }}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">
                    Apakah yakin?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-white/70">
                    Tugas yang dihapus tidak bisa dipulihkan. Tindakan ini akan
                    menghapus semua data terkait tugas ini.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      onClick={handleDelete}
                      disabled={mutation.isLoading}
                      variant="destructive"
                    >
                      {mutation.isLoading ? 'Menghapus...' : 'Hapus'}
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default DraggableItem
