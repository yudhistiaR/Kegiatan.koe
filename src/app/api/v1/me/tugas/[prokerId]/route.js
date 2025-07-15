import { prisma } from '@/lib/prisma'
import { MeService } from '@/app/api/services/me-service'
import { MeController } from '@/app/api/controllers/me-conttroller'
import { Validation } from '@/helpers/validation'
import { auth } from '@clerk/nextjs/server'

const meService = new MeService(prisma)
const meController = new MeController(meService, auth, Validation)

export async function GET(_, segmenDat) {
  const params = await segmenDat.params
  const prokerId = params.prokerId
  return meController.ME_TUGAS(prokerId)
}
