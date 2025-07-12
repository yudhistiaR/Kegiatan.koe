import { prisma } from '@/lib/prisma'
import { MeService } from '../../services/me-service'
import { MeController } from '../../controllers/me-conttroller'
import { Validation } from '@/helpers/validation'
import { auth } from '@clerk/nextjs/server'

const meService = new MeService(prisma)
const meController = new MeController(meService, auth, Validation)

export async function GET() {
  return meController.GETME()
}

export async function PUT(req) {
  return meController.UPDATEME(req)
}
