'use client'

import dynamic from 'next/dynamic'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ListAnggota = dynamic(() => import('@/components/organisasi/ListAnggota'))
const HakAkses = dynamic(() => import('@/components/organisasi/HakAkses'))

const OrganisasiSettingPage = () => {
  return (
    <Tabs defaultValue="anggota">
      <TabsList>
        <TabsTrigger value="anggota">Anggota</TabsTrigger>
        <TabsTrigger value="hak_akses">Hak Akses</TabsTrigger>
      </TabsList>
      <TabsContent value="anggota">
        <ListAnggota />
      </TabsContent>
      <TabsContent value="hak_akses">
        <HakAkses />
      </TabsContent>
    </Tabs>
  )
}

export default OrganisasiSettingPage
