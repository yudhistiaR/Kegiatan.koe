import { NotulenService } from '@/app/api/services/notulen-service'
import { NotulenController } from '@/app/api/controllers/notulen-controller'
import { prisma } from '@/lib/prisma'

const notulenService = new NotulenService(prisma)
const notulenController = new NotulenController(notulenService)

export async function GET(_, segmentData) {
  const params = await segmentData.params
  const org_id = params.org_id
  const proker_id = params.proker_id

  return notulenController.GETBYID(org_id, proker_id)
}

export async function POST(req) {
  return notulenController.CREATE(req)
}
