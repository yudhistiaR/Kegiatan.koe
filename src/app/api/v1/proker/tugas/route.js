import { prisma } from '@/lib/prisma'
import { TugasService } from '@/app/api/services/tugas-service'
import { TugasController } from '@/app/api/controllers/tugas-controller'
import { auth } from '@clerk/nextjs/server'
import { Validation } from '@/helpers/validation'
import { TugasSchema } from '@/schemas/backend/tugas-schema'

const tugasService = new TugasService(prisma)
const tugasController = new TugasController(
  tugasService,
  auth,
  Validation,
  TugasSchema
)

export async function GET() {
  return tugasController.GET()
}
