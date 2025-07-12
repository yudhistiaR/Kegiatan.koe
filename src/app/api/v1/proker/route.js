import { ProkerController } from '../../controllers/proker-controller'
import { ProkerService } from '../../services/proker-service'
import { Validation } from '@/helpers/validation'
import { ProkerSchema } from '@/schemas/backend/proker-schema'
import { prisma } from '@/lib/prisma'

const prokerService = new ProkerService(prisma)
const prokerController = new ProkerController(
  prokerService,
  Validation,
  ProkerSchema
)

export async function GET() {
  return prokerController.GET()
}

export async function POST(req) {
  return prokerController.CREATE(req)
}
