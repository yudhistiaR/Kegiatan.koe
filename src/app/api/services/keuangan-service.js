export class KeuanganService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async getByOrgId(orgId) {
    return await this.prisma.keuangan.findFirst({
      where: {
        orgId: orgId
      }
    })
  }

  //Sumber Dana
  async editSumberDanaProker(prokerId, data) {
    return await this.prisma.sumberDana.update({
      where: {
        id: prokerId
      },
      data: {
        ...data
      }
    })
  }

  async deleteSumberDanaProker(sumberId) {
    return await this.prisma.sumberDana.delete({
      where: {
        id: sumberId
      }
    })
  }

  async addSumberDanaProker(orgId, prokerId, data) {
    return await this.prisma.sumberDana.create({
      data: {
        prokerId,
        orgId,
        ...data
      }
    })
  }

  async getPendanaanProkerId(prokerId) {
    return await this.prisma.proker.findFirst({
      where: {
        id: prokerId
      },
      include: {
        divisi: true,
        organisasi: true,
        rab: {
          include: {
            listRab: true
          }
        },
        Pendanaan: true,
        ketua_pelaksana: true
      }
    })
  }

  async getPendanaanOrganisasi(orgId) {
    return await this.prisma.proker.findMany({
      where: {
        orgId: orgId
      },
      include: {
        divisi: true,
        organisasi: true,
        rab: {
          include: {
            listRab: true
          }
        },
        Pendanaan: true,
        ketua_pelaksana: true
      }
    })
  }
}
