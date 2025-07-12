import { prisma } from '@/lib/prisma'
import { DivisiService } from '@/app/api/services/divisi-service'
import { DivisiController } from '@/app/api/controllers/divisi-controller'
import { Validation } from '@/helpers/validation'
import { DivisiSchema } from '@/schemas/frontend/divisi-schema'
import { auth } from '@clerk/nextjs/server'

const divisiService = new DivisiService(prisma)
const divisiController = new DivisiController(
  divisiService,
  auth,
  Validation,
  DivisiSchema
)

export async function GET(_, segmenData) {
  const params = await segmenData.params
  const divisi_id = params.divisi_id

  return divisiController.GETBYID(divisi_id)
}

export async function POST(req) {
  return divisiController.addDivisiMember(req)
}
