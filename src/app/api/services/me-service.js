export class MeService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async GETME(id) {
    return await this.prisma.user.findFirst({
      where: {
        id: id ?? this.prisma.skip
      }
    })
  }

  async UPDATEME(user_id, data) {
    const { tanggal_lahir } = data

    return await this.prisma.user.update({
      where: {
        id: user_id
      },
      data: {
        ...data,
        tanggal_lahir: new Date(tanggal_lahir)
      }
    })
  }

  async ME_TUGAS(prokerId, userId) {
    return await this.prisma.tugas.findMany({
      where: {
        AND: [
          {
            assignedTo: {
              some: {
                // Gunakan 'some' untuk relasi many-to-many
                user: {
                  id: userId // Langsung akses field id
                }
              }
            }
          },
          {
            prokerId: prokerId
          }
        ]
      },
      orderBy: [{ status: 'asc' }, { order: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        divisiId: true,
        name: true,
        priority: true,
        description: true,
        status: true,
        order: true,
        start: true,
        end: true,
        divisi: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            jenis_jabatan: true,
            user: {
              select: {
                id: true,
                npm: true,
                email: true,
                telpon: true,
                username: true,
                profileImg: true,
                universitas: true,
                jenis_kelamin: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })
  }
}
