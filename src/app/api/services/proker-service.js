export class ProkerService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async GET(orgId) {
    return await this.prisma.proker.findMany({
      where: {
        orgId: orgId
      },
      select: {
        id: true,
        orgId: true,
        ketuaPelaksanaId: true,
        title: true,
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
        ketua_pelaksana: {
          select: {
            id: true,
            fullName: true
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
            listRab: {
              select: {
                id: true,
                rabId: true,
                nama: true,
                harga: true,
                jumlah: true,
                satuan: true
              }
            }
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
      },
      orderBy: {
        start: 'asc'
      }
    })
  }

  async GET_WITH_DIVISIONS_AND_MEMBERS(orgId) {
    return await this.prisma.proker.findMany({
      where: {
        orgId: orgId
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
        orgId: true,
        ketuaPelaksanaId: true,
        title: true,
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
        ketua_pelaksana: {
          select: {
            id: true,
            fullName: true
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
            listRab: {
              select: {
                id: true,
                rabId: true,
                nama: true,
                harga: true,
                jumlah: true,
                satuan: true
              }
            }
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

  async getProker(orgId, prokerId) {
    return await this.prisma.proker.findFirst({
      where: {
        id: prokerId,
        orgId: orgId
      },
      select: {
        id: true,
        orgId: true,
        ketuaPelaksanaId: true,
        title: true,
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
        ketua_pelaksana: {
          select: {
            id: true,
            fullName: true
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
            listRab: {
              select: {
                id: true,
                rabId: true,
                nama: true,
                harga: true,
                jumlah: true,
                satuan: true
              }
            }
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
        end: end ? new Date(end) : undefined
      }
    })
  }

  async deleteProker(orgId, prokerId) {
    return await this.prisma.proker.delete({
      where: {
        id: prokerId,
        orgId: orgId
      }
    })
  }

  async updateProker(orgId, prokerId, data) {
    const { start, end } = data

    return await this.prisma.proker.update({
      where: {
        id: prokerId,
        orgId: orgId
      },
      data: {
        ...data,
        start: new Date(start),
        end: new Date(end)
      }
    })
  }
}
