import { z } from 'zod'

const STATUS = ['TODO', 'INPROGRESS', 'REVIEW', 'DONE']

export class TugasSchema {
  static IDS = z.object({
    org_id: z.string().min(1),
    proker_id: z.string().min(1).uuid()
  })

  static CREATE = z.object({
    org_id: z.string().min(1),
    proker_id: z.string().min(1).uuid(),
    name: z.string().min(1).max(255),
    description: z.string().min(1).max(500)
  })

  static UPDATE = z.object({
    id: z.string().min(1),
    org_id: z.string().min(1),
    proker_id: z.string().min(1).uuid(),
    name: z.string().min(1).max(255),
    description: z.string().min(1).max(500),
    status: z.enum(STATUS),
    order: z.number()
  })
}
