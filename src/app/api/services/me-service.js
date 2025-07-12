export class MeService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async GETME(id) {
    return await this.prisma.user.findFirst({
      where: {
        id: id ?? this.prisma.skip
      }
    })
  }

  async UPDATEME(user_id, data) {
    const { tanggal_lahir } = data

    return await this.prisma.user.update({
      where: {
        id: user_id,
        clerkId: user_id
      },
      data: {
        ...data,
        tanggal_lahir: new Date(tanggal_lahir)
      }
    })
  }
}
