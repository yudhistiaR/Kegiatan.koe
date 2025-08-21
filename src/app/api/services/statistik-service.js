export class StatistikService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async dashboardStatistik(orgId) {
    //Jumlah proker organisai
    const jumlahProker = await this.prisma.proker.count({
      where: {
        orgId: orgId
      }
    })

    //total anggota
    const jumlahAnggtoa = await this.prisma.organisasi_member.count({
      where: {
        organisasiId: orgId
      }
    })

    //total tugas selesai
    const jumlahTugasSelesai = await this.prisma.tugas.count({
      where: {
        status: 'DONE',
        proker: {
          orgId: orgId
        }
      }
    })
    //total tugas tidak selesai
    const jumlahTugasBelum = await this.prisma.tugas.count({
      where: {
        status: {
          in: ['TODO', 'INPROGRESS', 'REVIEW']
        },
        proker: {
          orgId: orgId
        }
      }
    })
    //informasi tugas sudah selesai
    const informasiTugasSelesai = await this.prisma.tugas.findMany({
      where: {
        status: {
          in: ['DONE']
        },
        proker: {
          orgId: orgId
        }
      }
    })

    //anggota dengan penyelesai tugas terbanyak
    const anggotaRanking = await this.getAnggotaRanking(orgId)
    // Top 5 anggota dengan penyelesaian tugas terbanyak
    const top5Anggota = anggotaRanking.slice(0, 5)

    //Gabung Data
    const margeData = {
      proker: jumlahProker,
      anggota: jumlahAnggtoa,
      tugasSelesai: jumlahTugasSelesai,
      tugasTidakSelesai: jumlahTugasBelum,
      infoTugasSelesai: informasiTugasSelesai,
      topfiveMember: top5Anggota
    }

    return margeData
  }

  async getAnggotaRanking(orgId) {
    // Query untuk mendapatkan semua tugas selesai dengan assignee
    const tugasSelesai = await this.prisma.tugas.findMany({
      where: {
        status: 'DONE',
        proker: {
          orgId: orgId
        }
      },
      include: {
        assignedTo: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                profileImg: true,
                npm: true
              }
            },
            divisi: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    // Menghitung tugas per anggota
    const anggotaStats = {}

    tugasSelesai.forEach(tugas => {
      tugas.assignedTo.forEach(anggota => {
        const userId = anggota.user_id

        if (!anggotaStats[userId]) {
          anggotaStats[userId] = {
            user: anggota.user,
            divisi: anggota.divisi,
            tugasSelesai: 0,
            tugasIds: [],
            jabatan: anggota.jenis_jabatan
          }
        }

        anggotaStats[userId].tugasSelesai++
        anggotaStats[userId].tugasIds.push(tugas.id)
      })
    })

    // Mengubah object menjadi array dan mengurutkan
    const ranking = Object.values(anggotaStats)
      .sort((a, b) => b.tugasSelesai - a.tugasSelesai)
      .map((item, index) => ({
        rank: index + 1,
        ...item
      }))

    return ranking
  }
}
