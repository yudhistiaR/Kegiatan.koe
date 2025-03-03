import { AuthController } from '@/app/api/controllers/AuthController'

export async function GET() {
  console.log('runn')
  return await AuthController.REGISTER()
}
