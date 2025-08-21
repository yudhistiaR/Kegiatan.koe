import { z } from 'zod'

export class DivisiSchema {
  static CREATE = z.object({
    prokerId: z.string().min(1, 'ID proker harus diisi'),
    orgId: z.string().min(1, 'ID organisasi harus diisi'),
    kordinatorId: z.string().min(1, 'ID user harus diisi'),
    name: z.string().min(1, 'Nama divisi harus diisi'),
    description: z.string().min(1, 'Deskripsi divisi harus diisi').max(300)
  })
}
