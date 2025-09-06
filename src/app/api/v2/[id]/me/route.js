import { prisma } from '@/lib/prisma'
import { MeController } from '@/app/api/controllers/me-conttroller'
import { MeService } from '@/app/api/services/me-service'
import { auth } from '@clerk/nextjs/server'
import { ERROR_CODES } from '@/lib/errorCode'

const services = new MeService(prisma)
const controllers = new MeController(services, auth, ERROR_CODES)

export const GET = async (_, segmenData) => {
  const param = await segmenData.params
  const id = param.id

  return controllers.GETME(id)
}
