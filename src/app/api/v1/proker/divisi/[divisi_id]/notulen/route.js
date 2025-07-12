import { NotulenService } from '@/app/api/services/notulen-service'
import { NotulenController } from '@/app/api/controllers/notulen-controller'
import { prisma } from '@/lib/prisma'

const notulenService = new NotulenService(prisma)
const notulenController = new NotulenController(notulenService)

export async function GET() {
  return notulenController.GET()
}

export async function POST(req) {
  return notulenController.CREATE(req)
}
