import { z } from 'zod'

export class TaskSchema {
  static CREATE = z.object({
    orgId: z.string().min(1),
    divisiId: z.string().min(1),
    prokerId: z.string().min(1),
    status: z.string().min(1),
    name: z.string().min(1, 'Nama Tugas harus diisi'),
    priority: z.string().min(1, 'Prioritas harus diisi'),
    description: z.string().min(1, 'Deskripsi harus diisi'),
    assignedToIds: z.array(z.string()).min(1, 'Penugasan harus diisi'),
    start: z.string().min(1, 'Tanggal Persiapan harus diisi'),
    end: z.string().min(1, 'Tanggal Berakhir harus diisi')
  })
}
