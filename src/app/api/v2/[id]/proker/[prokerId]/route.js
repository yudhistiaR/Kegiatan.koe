import { prisma } from '@/lib/prisma'
import { ProkerService } from '@/app/api/services/proker-service'
import { ProkerController } from '@/app/api/controllers/proker-controller'
import { auth } from '@clerk/nextjs/server'

import { ERROR_CODES } from '@/lib/errorCode'

const services = new ProkerService(prisma)
const controllers = new ProkerController(services, auth, ERROR_CODES)

export async function DELETE(_, segmenData) {
  const param = await segmenData.params
  const orgId = param.id
  const prokerId = param.prokerId

  return controllers.DELETE(orgId, prokerId)
}

export async function PATCH(req, segmenData) {
  const param = await segmenData.params
  const orgId = param.id
  const prokerId = param.prokerId

  return controllers.UPDATE(orgId, prokerId, req)
}
