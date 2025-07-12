import { prisma } from '@/lib/prisma'
import { TugasService } from '@/app/api/services/tugas-service'
import { TugasController } from '@/app/api/controllers/tugas-controller'
import { Validation } from '@/helpers/validation'
import { TugasSchema } from '@/schemas/backend/tugas-schema'
import { auth } from '@clerk/nextjs/server'

const tugasService = new TugasService(prisma)
const tugasController = new TugasController(
  tugasService,
  auth,
  Validation,
  TugasSchema
)

export async function PUT(req) {
  return tugasController.UPDATE(req)
}
