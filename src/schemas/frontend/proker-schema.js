import { z } from 'zod'

export class ProkerSchema {
  static CREATE = z.object({
    title: z.string().min(1, 'Nama proker harus diisi'),
    org_id: z.string().min(1),
    author: z.string().min(1),
    description: z.string().min(1, 'Deskripsi proker harus diisi').max(500),
    start: z.string().min(1, 'Tanggal Persiapan harus diisi'),
    end: z.string().min(1, 'Tanggal Pelaksanaan harus diisi')
  })
}
