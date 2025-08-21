export class NotulenService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async GET() {
    return await this.prisma.notulensi.findMany()
  }

  async GET_BY_ORG(orgId) {
    return await this.prisma.notulensi.findMany({
      where: {
        org_id: orgId
      },
      select: {
        id: true,
        title: true,
        date: true,
        time: true,
        location: true,
        agenda: true,
        attendees: true,
        content: true
      }
    })
  }

  async CREATE(data) {
    return await this.prisma.notulensi.create({
      data: data
    })
  }

  async GETBYID(orgId, prokerId) {
    return await this.prisma.notulensi.findMany({
      where: {
        AND: [
          {
            org_id: orgId
          },
          {
            prokerId: prokerId
          }
        ]
      },
      select: {
        id: true,
        divisiId: true,
        org_id: true,
        prokerId: true,
        title: true,
        date: true,
        location: true,
        agenda: true,
        attendees: true,
        content: true,
        organisasi: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        proker: {
          select: {
            id: true,
            title: true,
            ketua_pelaksana: {
              select: {
                fullName: true
              }
            },
            description: true
          }
        },
        divisi: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    })
  }
}
