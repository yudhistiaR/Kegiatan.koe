import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Coins, ShieldCheck } from 'lucide-react'

import DetailKeuangan from '@/components/keuangan/DetailKeuangan'

const KeuanganPage = () => {
  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold mb-4">Keuangan Organisasi</h1>
      <Tabs defaultValue="keuangan">
        <TabsList>
          <TabsTrigger value="keuangan">
            <DollarSign />
            Keuangan
          </TabsTrigger>
          <TabsTrigger value="pendanaan_kegiatan">
            <Coins />
            Pendanaan Kegiatan
          </TabsTrigger>
          <TabsTrigger value="verifikasi">
            <ShieldCheck />
            Verifikasi Anggaran Kegiatan
          </TabsTrigger>
        </TabsList>
        <TabsContent value="keuangan">
          <DetailKeuangan />
        </TabsContent>
        <TabsContent value="pendanaan_kegiatan">
          Change your password here.
        </TabsContent>
        <TabsContent value="verifikasi">Change your password here.</TabsContent>
      </Tabs>
    </div>
  )
}

export default KeuanganPage
