import { RabController } from '@/app/api/controllers/rab-controller'
import { RabService } from '@/app/api/services/rab-service'
import { Validation } from '@/helpers/validation'
import { prisma } from '@/lib/prisma'

const rabService = new RabService(prisma)
const rabController = new RabController(rabService, Validation)

export async function DELETE(_, segmenData) {
  const params = await segmenData.params
  const rab_id = params.rab_id

  return rabController.DELETE(rab_id)
}
