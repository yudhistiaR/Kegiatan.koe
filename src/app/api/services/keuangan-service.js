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
}
