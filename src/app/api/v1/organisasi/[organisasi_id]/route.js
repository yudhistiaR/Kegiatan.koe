import { OrganisasiController } from '@/app/api/controllers/OrganisasiController'

export async function GET() {
  return await OrganisasiController.GETID()
}
