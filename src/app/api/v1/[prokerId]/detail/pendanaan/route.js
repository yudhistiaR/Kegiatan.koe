import { prisma } from '@/lib/prisma'
import { KeuanganService } from '@/app/api/services/keuangan-service'
import { KeuanganController } from '@/app/api/controllers/keuangan-controller'
import { auth } from '@clerk/nextjs/server'

const keuanganService = new KeuanganService(prisma)
const keuanganController = new KeuanganController(keuanganService, auth)

export async function GET(_, segmenData) {
  const params = await segmenData.params
  const prokerId = params.prokerId

  return keuanganController.getPendanaanProkerByProkerId(prokerId)
}
