import { prisma } from '@/lib/prisma'
import { TugasController } from '@/app/api/controllers/tugas-controller'
import { TugasService } from '@/app/api/services/tugas-service'
import { TugasSchema } from '@/schemas/backend/tugas-schema'
import { Validation } from '@/helpers/validation'
import { auth } from '@clerk/nextjs/server'

const tugasService = new TugasService(prisma)
const tugasController = new TugasController(
  tugasService,
  auth,
  Validation,
  TugasSchema
)

export async function GET(_, segmentData) {
  const params = await segmentData.params
  const org_id = params.org_id
  const proker_id = params.proker_id

  return tugasController.GET(org_id, proker_id)
}

export async function POST(req) {
  return tugasController.CREATE(req)
}

export async function PUT(req) {
  return tugasController.UPDATE(req)
}
