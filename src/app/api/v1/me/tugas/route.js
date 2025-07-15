import { prisma } from '@/lib/prisma'
import { Validation } from '@/helpers/validation'
import { auth } from '@clerk/nextjs/server'
import { MeService } from '@/app/api/services/me-service'
import { MeController } from '@/app/api/controllers/me-conttroller'

const meService = new MeService(prisma)
const meController = new MeController(meService, auth, Validation)

export async function GET() {
  return meController.ME_TUGAS(divisiId, userId)
}
