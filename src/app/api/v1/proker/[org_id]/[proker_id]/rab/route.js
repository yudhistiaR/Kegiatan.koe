import { RabController } from '@/app/api/controllers/rab-controller'
import { RabService } from '@/app/api/services/rab-service'
import { Validation } from '@/helpers/validation'
import { prisma } from '@/lib/prisma'

const rabService = new RabService(prisma)
const rabController = new RabController(rabService, Validation)

export async function GET(_, segmenData) {
  const params = await segmenData.params
  const prokerId = params.proker_id

  return rabController.GET(prokerId)
}

export async function POST(req) {
  return rabController.CREATE(req)
}
