export class UserService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async getUsers() {
    return await this.prisma.User.findMany()
  }
}
