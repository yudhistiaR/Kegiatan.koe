export class ProkerService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async GET(orgId) {
    if (orgId) {
      return await this.prisma.proker.findMany({
        where: {
          org_id: orgId
        }
      })
    }

    return []
  }

  async GET_WITH_DIVISIONS_AND_MEMBERS(orgId) {
    return await this.prisma.proker.findMany({
      where: {
        org_id: orgId
      },
      select: {
        id: true,
        title: true,
        divisi: {
          select: {
            id: true,
            name: true,
            anggota: {
              select: {
                jenis_jabatan: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    telpon: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        title: 'asc'
      }
    })
  }

  async GETBYID(orgId, proker_id) {
    return await this.prisma.proker.findMany({
      where: {
        id: proker_id
      },
      select: {
        id: true,
        org_id: true,
        title: true,
        author: true,
        description: true,
        start: true,
        end: true,
        created_at: true,
        divisi: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        tugas: {
          select: {
            id: true,
            name: true,
            description: true,
            priority: true,
            status: true,
            start: true,
            end: true
          }
        },
        rab: {
          select: {
            id: true,
            nama: true,
            harga: true,
            jumlah: true,
            satuan: true
          }
        },
        notulensi: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
            agenda: true,
            attendees: true,
            content: true
          }
        }
      }
    })
  }

  async CREATE(data) {
    const { start, end } = data

    return await this.prisma.proker.create({
      data: {
        ...data,
        start: new Date(start),
        end: end ? new Date(end) : prisma.skip
      }
    })
  }
}
