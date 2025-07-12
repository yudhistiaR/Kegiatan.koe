'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { converDateTime } from '@/lib/utils'
import { useParams } from 'next/navigation'

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
import { badgeVariants } from '@/components/ui/badge'
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

  const mutatation = useMutation({
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
    mutatation.mutate({ id: data.id })
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
          className={`bg-foreground cursor-grab rounded-none shadow-md ${
            isDragging && 'opacity-50 border-2 border-accentColor'
          }`}
        >
          <CardHeader>
            <CardTitle className="truncate flex justify-between items-center text-sm">
              <h1>{data.name}</h1>
              <p
                className={badgeVariants({
                  variant:
                    data.priority === 'HIGH'
                      ? 'destructive'
                      : data.priority === 'MEDIUM'
                        ? 'success'
                        : 'warning'
                })}
              >
                {data.priority}
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{data.description}</p>
          </CardContent>
          <CardFooter>
            <AvatarStack
              avatars={data.assignedTo.map(assigned => assigned.user)}
            />
          </CardFooter>
        </Card>
      </SheetTrigger>
      <SheetContent className="min-w-[400px]">
        <SheetHeader className="p-0 mt-10">
          <SheetTitle
            className="font-bold flex justify-between items-center"
            asChild
          >
            <div>
              <h1 className="text-xl">{data.name}</h1>
              <p
                className={badgeVariants({
                  variant:
                    data.priority === 'HIGH'
                      ? 'destructive'
                      : data.priority === 'MEDIUM'
                        ? 'success'
                        : 'warning'
                })}
              >
                {data.priority}
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4">
          <p className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-clock-plus-icon lucide-clock-plus"
            >
              <path d="M12 6v6l3.644 1.822" />
              <path d="M16 19h6" />
              <path d="M19 16v6" />
              <path d="M21.92 13.267a10 10 0 1 0-8.653 8.653" />
            </svg>{' '}
            {converDateTime(data.start)}
          </p>
          <p className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-clock-alert-icon lucide-clock-alert"
            >
              <path d="M12 6v6l4 2" />
              <path d="M16 21.16a10 10 0 1 1 5-13.516" />
              <path d="M20 11.5v6" />
              <path d="M20 21.5h.01" />
            </svg>{' '}
            {converDateTime(data.end)}
          </p>
          <p className="text-md font-semibold flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-star-half-icon lucide-star-half"
            >
              <path d="M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2" />
            </svg>{' '}
            {data.status}
          </p>
          <div className="flex flex-col gap-2">
            <p>Tugas Divisi :</p>
            <span className="font-semibold">{data.divisi.name}</span>
          </div>
          <div className="flex flex-col gap-2">
            <p>Ditugaskan Kepada :</p>
            <AvatarStack
              maxAvatarsAmount={10}
              spacing="md"
              avatars={data.assignedTo.map(assigned => assigned.user)}
            />
          </div>
          <textarea
            maxLength={300}
            placeholder="Deskripsi Tugas"
            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            defaultValue={data.description}
          />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {disabled && (
              <Button variant="destructive">
                {mutatation.isLoading ? 'Loading...' : 'Hapus'}
              </Button>
            )}
          </AlertDialogTrigger>
          <AlertDialogContent className="z-[999]">
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tugas yang di hapus tidak bisa dipulihkan !
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={handleDelete} disabled={mutatation.isLoading}>
                  {mutatation.isLoading ? 'Loading...' : 'Hapus'}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  )
}

export default DraggableItem
