import { prisma } from '@/lib/prisma'
import { KeuanganService } from '@/app/api/services/keuangan-service'
import { KeuanganController } from '@/app/api/controllers/keuangan-controller'
import { auth } from '@clerk/nextjs/server'

const keuanganService = new KeuanganService(prisma)
const keuanganController = new KeuanganController(keuanganService, auth)

export async function POST(req, segmenData) {
  const params = await segmenData.params
  const prokerId = params.prokerId

  return keuanganController.addSumberDanaProker(prokerId, req)
}

export async function DELETE(_, segmenData) {
  const params = await segmenData.params
  const prokerId = params.prokerId

  return keuanganController.deleteSumberDanaProker(prokerId)
}

export async function PUT(req, segmenData) {
  const params = await segmenData.params
  const prokerId = params.prokerId

  return keuanganController.editSumberDanaProker(prokerId, req)
}
