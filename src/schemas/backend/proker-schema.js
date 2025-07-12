import { z } from 'zod'

export class ProkerSchema {
  static CREATE = z.object({
    org_id: z.string().min(1),
    author: z.string().min(1).max(255),
    title: z.string().min(1).max(255),
    description: z.string().min(1).max(300),
    start: z.string().date(),
    end: z.string().date()
  })
}
