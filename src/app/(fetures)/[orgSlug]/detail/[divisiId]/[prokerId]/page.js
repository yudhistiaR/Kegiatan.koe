'use client'

import dynamic from 'next/dynamic'
import { useParams, notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@clerk/nextjs'

const KanbanBoard = dynamic(() => import('@/components/board/KanbanBoard'))
const DivisiDetail = dynamic(() => import('@/components/divisi/detail-divisi'))
const RabDivisi = dynamic(() => import('@/components/divisi/rab-divisi'))
const NotulensiDivisi = dynamic(
  () => import('@/components/divisi/notulensi-divisi')
)

const DivisiPage = () => {
  const { prokerId, divisiId } = useParams()
  const { orgId, userId, isLoaded } = useAuth()

  if (!isLoaded) <p>Loading....</p>

  if (!orgId && !userId && !prokerId && !divisiId) {
    notFound()
  }

  return (
    <Tabs defaultValue="detail" className="w-full">
      <TabsList>
        <TabsTrigger value="detail">Detail Divisi</TabsTrigger>
        <TabsTrigger value="tugas_divisi">Tugas Divisi</TabsTrigger>
        <TabsTrigger value="rab_divisi">RAB Divisi</TabsTrigger>
        <TabsTrigger value="notulensi_divisi">Notulensi Divisi</TabsTrigger>
      </TabsList>
      <TabsContent value="detail">
        <DivisiDetail />
      </TabsContent>
      <TabsContent value="tugas_divisi">
        <KanbanBoard scope="divisi" divisiId={divisiId} />
      </TabsContent>
      <TabsContent value="rab_divisi">
        <RabDivisi />
      </TabsContent>
      <TabsContent value="notulensi_divisi">
        <NotulensiDivisi />
      </TabsContent>
    </Tabs>
  )
}

export default DivisiPage
