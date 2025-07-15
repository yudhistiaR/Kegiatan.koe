'use client'

import { useState } from 'react'
//Componets
import { Label } from '@/components/ui/label'
import { SingleSelect } from '@/components/ui/CustomeSelect'
import { useQuery } from '@tanstack/react-query'
import KanbanBoard from '@/components/board/KanbanBoard'
import { LoadingState, ErrorState } from '@/components/LoadState/LoadStatus'

const MyTugas = () => {
  const [prokerId, setProkerId] = useState(null)

  const options = data => {
    return data.map(item => ({ value: item.id, label: item.title }))
  }

  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ['proker'],
    queryFn: async () => {
      const req = await fetch('/api/v1/proker')
      if (!req.ok) {
        throw new Error('Failed to fetch tasks')
      }
      return req.json()
    },
    select: data => options(data)
  })

  if (isLoading || isPending) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  const handleChange = selected => {
    setProkerId(selected.value)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tugas Saya</h1>
      <div className="flex items-center gap-2">
        <Label htmlFor="select_proker" className="text-md">
          Pilih atau cari Program Kerja
        </Label>
        <SingleSelect
          onChange={handleChange}
          id="select_proker"
          className="w-3/12"
          options={data}
        />
      </div>
      <KanbanBoard
        scope="me"
        showCreateDialog={false}
        enableDragAndDrop
        prokerId={prokerId}
      />
    </div>
  )
}

export default MyTugas
