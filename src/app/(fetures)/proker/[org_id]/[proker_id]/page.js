'use client'

import dynamic from 'next/dynamic'

// Hooks
import { useAuth } from '@clerk/nextjs'
import { notFound, useParams } from 'next/navigation'

//Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ProkerDivisi = dynamic(
  () => import('@/components/proker/Proker-divisi'),
  { loading: () => <p>Loading...</p> }
)
const ProkerDetail = dynamic(
  () => import('@/components/proker/Proker-detail'),
  { loading: () => <p>Loading...</p> }
)
const KanbanBoard = dynamic(() => import('@/components/board/KanbanBoard'), {
  loading: () => <p>Loading...</p>
})
const RabDivisi = dynamic(() => import('@/components/divisi/rab-divisi'), {
  loading: () => <p>Loading...</p>
})

const ProkerDetailMenu = () => {
  const { proker_id } = useParams()
  const { userId, orgId, isLoaded } = useAuth()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!userId && !orgId) {
    notFound()
  }

  return (
    <Tabs defaultValue="detail" className="w-full">
      <TabsList>
        <TabsTrigger value="detail">Detail Proker</TabsTrigger>
        <TabsTrigger value="tugas">Kanban Board</TabsTrigger>
        <TabsTrigger value="divisi">Pembagian Divisi</TabsTrigger>
        <TabsTrigger value="rab">RAB Program Kerja</TabsTrigger>
        <TabsTrigger value="notulensi">Notulesi</TabsTrigger>
      </TabsList>
      <TabsContent value="detail">
        <ProkerDetail />
      </TabsContent>
      <TabsContent value="tugas">
        <KanbanBoard
          scope="all"
          prokerId={proker_id}
          showCreateDialog={false}
          enableDragAndDrop={false}
        />
      </TabsContent>
      <TabsContent value="divisi">
        <ProkerDivisi />
      </TabsContent>
      <TabsContent value="rab">
        <RabDivisi />
      </TabsContent>
      <TabsContent value="notulensi">
        Notulesi hasil dari rapat yahhh
      </TabsContent>
    </Tabs>
  )
}

export default ProkerDetailMenu
