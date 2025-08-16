export class TugasService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async GET(proker_id) {
    return await this.prisma.tugas.findMany({
      where: {
        prokerId: proker_id
      },
      orderBy: [{ status: 'asc' }, { order: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        divisiId: true,
        orgId: true,
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

  async GET_BY_ID(id) {
    return await this.prisma.tugas.findMany({
      where: { divisiId: id },
      orderBy: [{ status: 'asc' }, { order: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        divisiId: true,
        orgId: true,
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

  async CREATE(data) {
    const {
      orgId,
      divisiId,
      prokerId,
      name,
      priority,
      description,
      assignedToIds = [],
      status = 'TODO',
      start,
      end
    } = data

    const tugasCount = await this.prisma.tugas.count({
      where: {
        divisiId: divisiId,
        status: status
      }
    })

    const createData = {
      orgId,
      divisiId,
      prokerId,
      name,
      priority,
      description,
      status,
      order: tugasCount,
      start: start ? new Date(start) : null,
      end: end ? new Date(end) : null
    }

    const anggotaDivisi = await this.prisma.anggotaDivisi.findMany({
      where: {
        userId: { in: assignedToIds },
        divisiId: divisiId
      }
    })

    if (anggotaDivisi.length > 0) {
      createData.assignedTo = {
        connect: anggotaDivisi.map(anggota => ({ id: anggota.id }))
      }
    }

    return await this.prisma.tugas.create({
      data: createData,
      include: {
        divisi: {
          select: {
            id: true,
            name: true
          }
        },
        assignedTo: {
          include: {
            user: {
              select: {
                id: true,
                npm: true,
                username: true,
                firstName: true,
                lastName: true,
                fullName: true
              }
            }
          }
        }
      }
    })
  }

  async UPDATE(data) {
    const {
      id,
      orgId,
      divisiId,
      name,
      priority,
      description,
      status,
      start,
      end,
      order,
      assignedToIds, // AnggotaDivisi IDs
      assignedUserIds // User IDs (alternative)
    } = data

    const updateData = {}

    if (orgId !== undefined) updateData.orgId = orgId
    if (divisiId !== undefined) updateData.divisiId = divisiId
    if (name !== undefined) updateData.name = name
    if (priority !== undefined) updateData.priority = priority
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (order !== undefined) updateData.order = order
    if (start !== undefined) updateData.start = start ? new Date(start) : null
    if (end !== undefined) updateData.end = end ? new Date(end) : null

    // Handle assignment update by AnggotaDivisi IDs
    if (assignedToIds !== undefined) {
      updateData.assignedTo = {
        set: assignedToIds.map(assignedId => ({ id: assignedId }))
      }
    }
    // Handle assignment update by User IDs
    else if (assignedUserIds !== undefined) {
      const tugasInfo = await this.prisma.tugas.findUnique({
        where: { id },
        select: { divisiId: true }
      })

      if (tugasInfo) {
        const anggotaDivisi = await this.prisma.anggotaDivisi.findMany({
          where: {
            userId: { in: assignedUserIds },
            divisiId: tugasInfo.divisiId
          }
        })

        updateData.assignedTo = {
          set: anggotaDivisi.map(anggota => ({ id: anggota.id }))
        }
      }
    }

    return await this.prisma.tugas.update({
      where: { id },
      data: updateData,
      include: {
        divisi: {
          select: {
            id: true,
            name: true
          }
        },
        assignedTo: {
          include: {
            user: {
              select: {
                id: true,
                npm: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })
  }

  async ASSIGN_USERS(tugasId, assignedToIds) {
    return await this.prisma.tugas.update({
      where: { id: tugasId },
      data: {
        assignedTo: {
          set: assignedToIds.map(id => ({ id }))
        }
      },
      include: {
        assignedTo: {
          include: {
            user: {
              select: {
                id: true,
                npm: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })
  }

  async ASSIGN_BY_USER_IDS(tugasId, userIds, divisiId) {
    // Cari AnggotaDivisi berdasarkan user_id dan divisi_id
    const anggotaDivisi = await this.prisma.anggotaDivisi.findMany({
      where: {
        user_id: { in: userIds },
        divisi_id: divisiId
      }
    })

    const anggotaIds = anggotaDivisi.map(anggota => anggota.id)

    return await this.prisma.tugas.update({
      where: { id: tugasId },
      data: {
        assignedTo: {
          set: anggotaIds.map(id => ({ id }))
        }
      },
      include: {
        assignedTo: {
          include: {
            user: {
              select: {
                id: true,
                npm: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })
  }

  async ADD_ASSIGNEE_BY_USER_ID(tugasId, userId, divisiId) {
    // Cari AnggotaDivisi berdasarkan user_id dan divisi_id
    const anggotaDivisi = await this.prisma.anggotaDivisi.findFirst({
      where: {
        user_id: userId,
        divisi_id: divisiId
      }
    })

    if (!anggotaDivisi) {
      return null // User bukan anggota divisi ini
    }

    return await this.prisma.tugas.update({
      where: { id: tugasId },
      data: {
        assignedTo: {
          connect: { id: anggotaDivisi.id }
        }
      },
      include: {
        assignedTo: {
          include: {
            user: {
              select: {
                id: true,
                npm: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })
  }

  async REMOVE_ASSIGNEE_BY_USER_ID(tugasId, userId, divisiId) {
    // Cari AnggotaDivisi berdasarkan user_id dan divisi_id
    const anggotaDivisi = await this.prisma.anggotaDivisi.findFirst({
      where: {
        user_id: userId,
        divisi_id: divisiId
      }
    })

    if (!anggotaDivisi) {
      return null // User bukan anggota divisi ini
    }

    return await this.prisma.tugas.update({
      where: { id: tugasId },
      data: {
        assignedTo: {
          disconnect: { id: anggotaDivisi.id }
        }
      },
      include: {
        assignedTo: {
          include: {
            user: {
              select: {
                id: true,
                npm: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })
  }

  async ADD_ASSIGNEE(tugasId, anggotaDivisiId) {
    return await this.prisma.tugas.update({
      where: { id: tugasId },
      data: {
        assignedTo: {
          connect: { id: anggotaDivisiId }
        }
      },
      include: {
        assignedTo: {
          include: {
            user: {
              select: {
                id: true,
                npm: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })
  }

  async REMOVE_ASSIGNEE(tugasId, anggotaDivisiId) {
    return await this.prisma.tugas.update({
      where: { id: tugasId },
      data: {
        assignedTo: {
          disconnect: { id: anggotaDivisiId }
        }
      },
      include: {
        assignedTo: {
          include: {
            user: {
              select: {
                id: true,
                npm: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })
  }

  async UPDATES(data) {
    const { tasks } = data

    return await this.prisma.$transaction(
      tasks.map(item => {
        const updateData = {}

        if (item.order !== undefined) updateData.order = item.order
        if (item.status !== undefined) updateData.status = item.status
        if (item.priority !== undefined) updateData.priority = item.priority

        return this.prisma.tugas.update({
          where: { id: item.id },
          data: updateData
        })
      })
    )
  }

  async DELETE(data) {
    const { id } = data
    return await this.prisma.tugas.delete({
      where: { id }
    })
  }

  async REORDER_TASKS(divisiId, tasks) {
    const tasksByStatus = tasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = []
      }
      acc[task.status].push(task)
      return acc
    }, {})

    const updatePromises = []

    Object.entries(tasksByStatus).forEach(([status, statusTasks]) => {
      statusTasks.forEach((task, index) => {
        updatePromises.push(
          this.prisma.tugas.update({
            where: { id: task.id },
            data: {
              order: index,
              status: status
            }
          })
        )
      })
    })

    return await this.prisma.$transaction(updatePromises)
  }

  async GET_TASK_COUNTS_BY_DIVISI(org_id) {
    const stats = await this.prisma.tugas.groupBy({
      by: ['divisiId', 'status'],
      where: {
        divisi: {
          org_id: org_id
        }
      },
      _count: {
        status: true
      }
    })

    const formattedStats = stats.reduce((acc, stat) => {
      if (!acc[stat.divisiId]) {
        acc[stat.divisiId] = {}
      }
      acc[stat.divisiId][stat.status] = stat._count.status
      return acc
    }, {})

    return formattedStats
  }

  async GET_USER_TASKS(userId) {
    return await this.prisma.tugas.findMany({
      where: {
        assignedTo: {
          some: {
            user_id: userId
          }
        }
      },
      include: {
        divisi: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        assignedTo: {
          include: {
            user: {
              select: {
                id: true,
                npm: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: [{ status: 'asc' }, { priority: 'desc' }, { order: 'asc' }]
    })
  }

  async GET_TASKS_BY_MEMBER(org_id) {
    return await this.prisma.tugas.findMany({
      where: {
        proker: {
          org_id: org_id
        }
      },
      include: {
        proker: {
          select: {
            title: true
          }
        },
        assignedTo: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: [{ status: 'asc' }, { name: 'asc' }]
    })
  }

  async GET_BY_ORG(org_id) {
    return await this.prisma.tugas.findMany({
      where: {
        proker: {
          org_id: org_id
        }
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
        proker: {
          select: {
            id: true,
            title: true,
            org_id: true
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

  async GET_DIVISI_MEMBERS(divisiId) {
    return await this.prisma.anggotaDivisi.findMany({
      where: {
        divisi_id: divisiId
      },
      include: {
        user: {
          select: {
            id: true,
            npm: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImg: true
          }
        }
      }
    })
  }
}
