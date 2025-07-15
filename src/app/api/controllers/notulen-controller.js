import { NextResponse } from 'next/server'
import { ReponseError } from '../errors/ResponseError'

export class NotulenController {
  constructor(service, clerk, validation, schema) {
    this.service = service
    this.clerk = clerk
    this.validation = validation
    this.schema = schema
  }

  async CREATE(data) {
    const body = await data.json()

    try {
      const data = await this.service.CREATE(body)
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async GET() {
    try {
      const data = await this.service.GET()

      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async GETBYID(orgId, prokerId) {
    try {
      const data = await this.service.GETBYID(orgId, prokerId)
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }
}
