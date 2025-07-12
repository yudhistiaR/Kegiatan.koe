import { prisma } from '@/lib/prisma'
import { OrganisasiService } from '@/app/api/services/organisasi-service'
import { ProkerService } from '@/app/api/services/proker-service'
import { RabService } from '@/app/api/services/rab-service'
import { TugasService } from '@/app/api/services/tugas-service'
import { NotulenService } from '@/app/api/services/notulen-service'
import { DivisiService } from '@/app/api/services/divisi-service'
import { LaporanController } from '@/app/api/controllers/laporan-controller'
import { auth } from '@clerk/nextjs/server'

const organisasiService = new OrganisasiService(prisma)
const prokerService = new ProkerService(prisma)
const rabService = new RabService(prisma)
const tugasService = new TugasService(prisma)
const notulenService = new NotulenService(prisma)
const divisiService = new DivisiService(prisma)

const laporanController = new LaporanController(
  organisasiService,
  prokerService,
  rabService,
  tugasService,
  notulenService,
  divisiService,
  auth
)

export async function GET(_, segmenData) {
  const params = await segmenData.params
  const org_id = params.org_id

  return laporanController.getStrukturKepanitiaan(org_id)
}
