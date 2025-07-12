import { RabController } from '@/app/api/controllers/rab-controller'
import { RabService } from '@/app/api/services/rab-service'
import { Validation } from '@/helpers/validation'
import { prisma } from '@/lib/prisma'

const rabService = new RabService(prisma)
const rabController = new RabController(rabService, Validation)

export async function GET() {
  return rabController.GETALL()
}
