import { prisma } from '@/lib/prisma'
import { DivisiService } from '@/app/api/services/divisi-service'
import { DivisiController } from '@/app/api/controllers/divisi-controller'
import { Validation } from '@/helpers/validation'
import { DivisiSchema } from '@/schemas/backend/divisi-schema'
import { auth } from '@clerk/nextjs/server'

const divisiService = new DivisiService(prisma)
const divisiController = new DivisiController(
  divisiService,
  auth,
  Validation,
  DivisiSchema
)

export async function GET(_, segmentData) {
  const params = await segmentData.params
  const org_id = params.org_id
  const proker_id = params.proker_id

  return divisiController.GET(org_id, proker_id)
}

export async function POST(req) {
  return divisiController.CREATE(req)
}

export async function DELETE(req, segmentData) {
  const divisi_id = req?.nextUrl?.searchParams.get('id')
  const params = await segmentData.params
  const org_id = params.org_id
  const proker_id = params.proker_id

  return divisiController.DELETE(org_id, proker_id, divisi_id)
}
