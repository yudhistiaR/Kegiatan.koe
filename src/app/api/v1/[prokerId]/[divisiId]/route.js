import { prisma } from '@/lib/prisma'
import { TugasService } from '@/app/api/services/tugas-service'
import { TugasController } from '@/app/api/controllers/tugas-controller'
import { auth } from '@clerk/nextjs/server'
import { Validation } from '@/helpers/validation'
import { TugasSchema } from '@/schemas/backend/tugas-schema'

const tugasService = new TugasService(prisma)
const tugasController = new TugasController(
  tugasService,
  auth,
  Validation,
  TugasSchema
)

export async function GET(_, segmenData) {
  const params = await segmenData.params
  const divisi_id = params.divisiId
  const proker_id = params.prokerId

  return tugasController.GET(divisi_id, proker_id)
}

export async function POST(req) {
  return tugasController.CREATE(req)
}

//Tugas Update
export async function PUT(req) {
  return tugasController.UPDATE(req)
}

export async function DELETE(req) {
  return tugasController.DELETE(req)
}
