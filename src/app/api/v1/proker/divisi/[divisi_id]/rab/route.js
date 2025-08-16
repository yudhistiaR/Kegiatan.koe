import { RabController } from '@/app/api/controllers/rab-controller'
import { RabService } from '@/app/api/services/rab-service'
import { Validation } from '@/helpers/validation'
import { prisma } from '@/lib/prisma'

const rabService = new RabService(prisma)
const rabController = new RabController(rabService, Validation)

export async function GET(_, segmenData) {
  const params = await segmenData.params
  const divisi_id = params.divisi_id

  return rabController.GET(divisi_id)
}

export async function POST(req, segmenData) {
  const params = await segmenData.params
  const divisi_id = params.divisi_id

  return rabController.CREATE(req, divisi_id)
}

export async function PATCH(req) {
  return rabController.UPDATERABSTATUS(req)
}
