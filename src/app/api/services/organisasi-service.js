export class OrganisasiService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async organisasiMembers(org_id) {
    return await this.prisma.organisasi_member.findMany({
      where: {
        organisasiId: org_id
      },
      select: {
        id: true,
        clerkMemId: true,
        role: true,
        user: {
          select: {
            id: true,
            clerkId: true,
            username: true,
            npm: true,
            email: true,
            universitas: true,
            telpon: true,
            bio: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })
  }
}
