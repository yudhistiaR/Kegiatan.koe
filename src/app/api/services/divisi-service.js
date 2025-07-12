export class DivisiService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async GETBYID(divisi_id) {
    return this.prisma.divisi.findMany({
      orderBy: {
        name: 'asc'
      },
      where: {
        id: divisi_id ?? this.prisma.skip
      },
      select: {
        id: true,
        name: true,
        description: true,
        created_at: true,
        updated_at: true,
        anggota: {
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
                jenis_kelamin: true
              }
            },
            created_at: true
          }
        }
      }
    })
  }

  async GET(data) {
    const { org_id, proker_id } = data

    return this.prisma.divisi.findMany({
      orderBy: {
        name: 'asc'
      },
      where: {
        org_id: org_id ?? this.prisma.skip,
        proker_id: proker_id ?? this.prisma.skip
      },
      select: {
        id: true,
        name: true,
        description: true,
        created_at: true,
        updated_at: true,
        anggota: {
          select: {
            id: true,
            jenis_jabatan: true,
            user: {
              select: {
                id: true,
                npm: true,
                email: true,
                username: true,
                profileImg: true
              }
            }
          }
        }
      }
    })
  }

  async GET_DIVISIONS_WITH_MEMBERS_BY_ORG(orgId) {
    return this.prisma.divisi.findMany({
      where: {
        org_id: orgId
      },
      select: {
        id: true,
        name: true,
        description: true,
        anggota: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })
  }

  async CREATE(data) {
    return this.prisma.divisi.create({
      data: {
        org_id: data.org_id,
        name: data.name,
        description: data.description,
        proker: {
          connect: {
            id: data.proker_id
          }
        },
        anggota: {
          connectOrCreate: {
            create: {
              jenis_jabatan: 'KORDINATOR',
              user: {
                connect: {
                  id: data.user_id
                }
              }
            },
            where: {
              id: data.user_id
            }
          }
        }
      }
    })
  }

  async addDivisiMember(data) {
    const { divisi_id, members } = data

    const findNotDuplicated = (arr1, arr2) => {
      const combinedArray = [...arr1, ...arr2]
      const uniqueElements = combinedArray.filter(
        (element, _, array) =>
          array.indexOf(element) === array.lastIndexOf(element)
      )
      return uniqueElements
    }

    const isExitingMember = await this.prisma.anggotaDivisi.findMany({
      where: {
        divisi_id: divisi_id,
        user_id: {
          in: members
        }
      }
    })

    const isNotDuplicated = findNotDuplicated(
      members,
      isExitingMember.map(item => item.user_id)
    )

    if (isNotDuplicated.length <= 0) return

    await this.prisma.anggotaDivisi.createMany({
      data: isNotDuplicated.map(item => ({
        divisi_id: divisi_id,
        user_id: item
      })),
      skipDuplicates: true
    })
  }

  async DELETE(data) {
    const { org_id, proker_id, divisi_id } = data

    return this.prisma.divisi.delete({
      where: {
        id: divisi_id ?? this.prisma.skip,
        proker_id: proker_id ?? this.prisma.skip,
        org_id: org_id ?? this.prisma.skip
      }
    })
  }
}
