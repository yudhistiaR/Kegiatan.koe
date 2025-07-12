'use client'

import { notFound } from 'next/navigation'
import { ProkerForm } from '@/components/proker/form'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import ProkerList from '@/components/proker/Proker-list'
import { useAuth } from '@clerk/nextjs'

const ProkerPage = () => {
  const { userId, orgId, isLoaded } = useAuth()

  if (!isLoaded) return
  if (!userId && !orgId) notFound()

  return (
    <div className="w-full h-full">
      {userId && orgId ? (
        <div className="mb-4 sticky top-0 right-0 bg-background p-4 rounded-md shadow-lg flex justify-end items-center gap-4 z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button>+ Buat</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Buat Proker</SheetTitle>
                <SheetDescription>
                  Buat Program Kerja ada disini. Klik simpan ketian selesai.
                </SheetDescription>
              </SheetHeader>
              {/* Proker Form */}
              <ProkerForm />
              {/* Proker Form End */}
            </SheetContent>
          </Sheet>
        </div>
      ) : null}
      {/* Proker List */}
      <ProkerList />
    </div>
  )
}

export default ProkerPage
