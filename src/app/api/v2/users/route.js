import { prisma } from '@/lib/prisma'
import { UserService } from '@/app/api/services/user-service'
import { UserController } from '@/app/api/controllers/user-controller'
import { auth } from '@clerk/nextjs/server'

import { ERROR_CODES } from '@/lib/errorCode'

const services = new UserService(prisma)
const controllers = new UserController(services, auth, ERROR_CODES)

export function GET() {
  return controllers.getUsers()
}
