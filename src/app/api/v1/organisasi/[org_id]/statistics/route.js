import { prisma } from '@/lib/prisma'
import { StatistikController } from '@/app/api/controllers/statistik-controller'
import { StatistikService } from '@/app/api/services/statistik-service'
import { auth } from '@clerk/nextjs/server'

const statistikService = new StatistikService(prisma)
const statistikController = new StatistikController(statistikService, auth)

export async function GET(_, segmenData) {
  const params = await segmenData.params
  const org_id = params.org_id

  return statistikController.dashboardSatistik(org_id)
}
