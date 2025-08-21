import { RabController } from '@/app/api/controllers/rab-controller'
import { RabService } from '@/app/api/services/rab-service'
import { Validation } from '@/helpers/validation'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

const rabService = new RabService(prisma)
const rabController = new RabController(rabService, auth, Validation)

export async function GET() {
  return rabController.GETALL()
}

export async function PATCH(req) {
  return rabController.UPDATERABSTATUS(req)
}
