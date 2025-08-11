'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { Button } from '../ui/button'

const DetailKeuangan = () => {
  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center h-[100px] bg-accentColor p-4 rounded-md text-3xl font-bold mb-4">
        <h1>Sisa Dana Organisasi</h1>
        <div className="flex justify-center items-center gap-2">
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="secondary"
                className="rounded-full hover:cursor-pointer"
              >
                <Plus size={50} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="shadow-md">
              <p>Catat Dana Masuk</p>
            </TooltipContent>
          </Tooltip>
          <p>{formatCurrency(2000000)}</p>
        </div>
      </div>
      <div className="w-full h-full border p-4 rounded-md">
        <h1 className="text-2xl font-bold mb-4">History Pendanaan</h1>
        <div className="flex justify-between items-center">
          <div className="flex-1 bg-red-200">
            <h2>Dana Masuk</h2>
          </div>
          <div className="flex-1 bg-red-400">
            <h2>Dana Keluar</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailKeuangan
