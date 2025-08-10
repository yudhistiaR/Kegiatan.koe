'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ProkerForm } from '@/components/proker/form'

const CreateProker = () => {
  return (
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
  )
}

export default CreateProker
