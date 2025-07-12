import { z } from 'zod'

export class DivisiSchema {
  static GETID = z.object({
    org_id: z.string().min(1),
    proker_id: z.string().min(1).uuid()
  })

  static GETIDS = z.object({
    divisi_id: z.string().min(1).uuid(),
    org_id: z.string().min(1),
    proker_id: z.string().min(1).uuid()
  })

  static CREATE = z.object({
    org_id: z.string().min(1),
    user_id: z.string().min(1),
    proker_id: z.string().min(1).uuid(),
    name: z.string().min(1).max(255),
    description: z.string().min(1).max(500)
  })
}
