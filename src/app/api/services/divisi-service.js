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
        orgId: true,
        prokerId: true,
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
                fullName: true,
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
        orgId: org_id ?? this.prisma.skip,
        prokerId: proker_id ?? this.prisma.skip
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
                fullName: true,
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
        orgId: orgId
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
        ...data,
        anggota: {
          connectOrCreate: {
            create: {
              jenis_jabatan: 'KORDINATOR',
              user: {
                connect: {
                  id: data.kordinatorId
                }
              }
            },
            where: {
              id: data.kordinatorId
            }
          }
        }
      }
    })
  }

  async addDivisiMember(data) {
    const { divisiId, members } = data

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
        divisiId: divisiId,
        userId: {
          in: members
        }
      }
    })

    const isNotDuplicated = findNotDuplicated(
      members,
      isExitingMember.map(item => item.userId)
    )

    if (isNotDuplicated.length <= 0) return

    await this.prisma.anggotaDivisi.createMany({
      data: isNotDuplicated.map(item => ({
        divisiId: divisiId,
        userId: item
      })),
      skipDuplicates: true
    })
  }

  async DELETE(data) {
    const { org_id, proker_id, divisi_id } = data

    return this.prisma.divisi.delete({
      where: {
        id: divisi_id ?? this.prisma.skip,
        prokerId: proker_id ?? this.prisma.skip,
        orgId: org_id ?? this.prisma.skip
      }
    })
  }
}
