import { prisma } from '@/lib/prisma'
import { OrganisasiService } from '@/app/api/services/organisasi-service'
import { OrganisasiController } from '@/app/api/controllers/organisasi-controller'
import { auth } from '@clerk/nextjs/server'

const organisasiService = new OrganisasiService(prisma)
const organisasiController = new OrganisasiController(organisasiService, auth)

export async function GET(_, segmenData) {
  const params = await segmenData.params
  const org_id = params.org_id

  return organisasiController.getOrganisasiMembers(org_id)
}
