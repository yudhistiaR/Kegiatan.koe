import { prisma } from '@/utils/db'

export class AuthService {
  static async REGISTER() {
    const datas = await prisma.organisasi.findMany()
    return datas
  }
}
