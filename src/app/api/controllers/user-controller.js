import { NextResponse } from 'next/server'
import { ErrorResponse } from '@/helpers/error'

export class UserController {
  constructor(service, clerk, errorStatus) {
    this.service = service
    this.clerk = clerk
    this.errorStatus = errorStatus
  }

  async getUsers() {
    try {
      const datas = await this.service.getUsers()

      if (!datas || datas.length === 0) {
        return NextResponse.json(this.errorStatus['DATA_NOT_FOUND'])
      }

      return NextResponse.json(datas, { status: 200 })
    } catch (error) {
      return ErrorResponse(error)
    }
  }
}
