export class RabService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async GET_BY_ORG(orgId) {
    return await this.prisma.rab.findMany({
      where: {
        orgId: orgId
      },
      include: {
        proker: {
          select: {
            title: true
          }
        }
      }
    })
  }

  async GET_TOTAL_RAB_BY_DIVISI(orgId) {
    const rabItems = await this.prisma.rab.findMany({
      where: {
        organisasi: {
          id: orgId
        }
      },
      select: {
        divisiId: true,
        harga: true,
        jumlah: true
      }
    })

    const totals = rabItems.reduce((acc, item) => {
      if (!acc[item.divisiId]) {
        acc[item.divisiId] = 0
      }
      acc[item.divisiId] += item.harga * item.jumlah
      return acc
    }, {})

    return totals
  }

  async GETALL() {
    return await this.prisma.rab.findMany({
      select: {
        id: true,
        prokerId: true,
        divisiId: true,
        nama: true,
        harga: true,
        jumlah: true,
        satuan: true,
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
            author: true,
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

  async GET(id) {
    return await this.prisma.rab.findMany({
      where: {
        OR: [
          {
            divisiId: id
          },
          {
            prokerId: id
          }
        ]
      },
      select: {
        id: true,
        prokerId: true,
        divisiId: true,
        nama: true,
        harga: true,
        jumlah: true,
        satuan: true,
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
            author: true,
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

  async CREATE(data) {
    return await this.prisma.rab.create({
      data: data
    })
  }

  async DELETE(id) {
    return await this.prisma.rab.delete({
      where: { id }
    })
  }
}
