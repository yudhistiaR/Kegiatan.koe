import { PrismaClient } from '@/generated/prisma'
import { logger } from './logger'

export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    },
    {
      emit: 'event',
      level: 'error'
    },
    {
      emit: 'event',
      level: 'warn'
    }
  ]
})

prisma.$on('error', e => {
  logger.error(e)
})

prisma.$on('info', e => {
  logger.info(e)
})

prisma.$on('warn', e => {
  logger.warn(e)
})
