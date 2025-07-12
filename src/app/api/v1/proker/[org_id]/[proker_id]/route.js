import { prisma } from '@/lib/prisma'
import { ProkerController } from '@/app/api/controllers/proker-controller'
import { ProkerService } from '@/app/api/services/proker-service'
import { Validation } from '@/helpers/validation'
import { ProkerSchema } from '@/schemas/backend/proker-schema'
import { auth } from '@clerk/nextjs/server'

const prokerService = new ProkerService(prisma)
const prokerController = new ProkerController(
  prokerService,
  auth,
  Validation,
  ProkerSchema
)

export async function GET(_, segmentData) {
  const params = await segmentData.params
  const prokerId = params.proker_id

  return prokerController.GETBYID(prokerId)
}
