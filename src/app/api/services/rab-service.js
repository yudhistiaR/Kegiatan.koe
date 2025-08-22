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

  async updateRevisiStatus(data) {
    return await this.prisma.rab.update({
      where: {
        id: data.id
      },
      data: {
        total_revisi: data.total_revisi + 1,
        status: 'PENDING'
      }
    })
  }

  async updateRabStatus(data) {
    return await this.prisma.rab.update({
      where: {
        id: data.rabId
      },
      data: {
        status: data.status,
        note: data.notes
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
        id: true,
        orgId: true,
        prokerId: true,
        divisiId: true,
        status: true,
        note: true,
        total_revisi: true,
        listRab: {
          select: {
            id: true,
            nama: true,
            harga: true,
            jumlah: true,
            satuan: true
          }
        },
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
            ketua_pelaksana: true,
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

    const totals = rabItems.reduce((acc, item) => {
      if (!acc[item.divisiId]) {
        acc[item.divisiId] = 0
      }
      acc[item.divisiId] += item.harga * item.jumlah
      return acc
    }, {})

    return totals
  }

  async GETALL(orgId) {
    return await this.prisma.rab.findMany({
      where: {
        orgId: orgId
      },
      select: {
        id: true,
        orgId: true,
        prokerId: true,
        divisiId: true,
        status: true,
        note: true,
        total_revisi: true,
        listRab: {
          select: {
            id: true,
            nama: true,
            harga: true,
            jumlah: true,
            satuan: true
          }
        },
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
            ketua_pelaksana: true,
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
        orgId: true,
        prokerId: true,
        divisiId: true,
        status: true,
        note: true,
        total_revisi: true,
        listRab: {
          select: {
            id: true,
            nama: true,
            harga: true,
            jumlah: true,
            satuan: true
          }
        },
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
            ketua_pelaksana: true,
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
    const findRab = await this.prisma.rab.upsert({
      where: {
        divisiId: data.divisiId
      },
      create: {
        orgId: data.orgId,
        divisiId: data.divisiId,
        prokerId: data.prokerId,
        listRab: {
          create: [
            {
              nama: data.nama,
              harga: data.harga,
              jumlah: data.jumlah,
              satuan: data.satuan
            }
          ]
        }
      },
      update: {
        listRab: {
          create: [
            {
              nama: data.nama,
              harga: data.harga,
              jumlah: data.jumlah,
              satuan: data.satuan
            }
          ]
        }
      },
      include: {
        listRab: true
      }
    })

    return findRab
  }

  async DELETE(id) {
    return await this.prisma.listRab.delete({
      where: { id }
    })
  }
}
