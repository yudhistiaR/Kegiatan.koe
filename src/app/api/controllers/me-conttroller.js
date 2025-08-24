import { NextResponse } from 'next/server'
import { ReponseError } from '../errors/ResponseError'

export class MeController {
  constructor(meService, clerk, validation, schema) {
    this.service = meService
    this.clerk = clerk
    this.validation = validation
    this.schema = schema
  }

  async GETME() {
    try {
      const { userId } = await this.clerk()

      if (!userId)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      const res = await this.service.GETME(userId)

      return NextResponse.json(res, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async UPDATEME(data) {
    try {
      const newData = await data.json()
      const { userId } = await this.clerk()

      if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }

      const res = await this.service.UPDATEME(userId, newData)

      return NextResponse.json(res, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async ME_TUGAS(prokerId) {
    try {
      const { userId } = this.clerk()

      if (!userId)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      const tugas = await this.service.ME_TUGAS(prokerId, userId)

      return NextResponse.json(tugas, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }
}
