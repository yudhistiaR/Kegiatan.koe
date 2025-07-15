import { ReponseError } from '../errors/ResponseError'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export class ProkerController {
  constructor(prokerService, validation, schema) {
    this.prokerService = prokerService
    this.validation = validation
    this.schema = schema
  }

  async GET() {
    const { orgId } = auth()

    try {
      const res = await this.prokerService.GET(orgId)
      return NextResponse.json(res, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async GETBYID(proker_id) {
    const { orgId } = await auth()

    try {
      const res = await this.prokerService.GETBYID(orgId, proker_id)
      return NextResponse.json(res, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async CREATE(req) {
    try {
      const body = await req.json()
      const validBody = this.validation.validate(this.schema.CREATE, body)
      const res = await this.prokerService.CREATE(validBody)
      return NextResponse.json(res, { status: 201 })
    } catch (error) {
      return ReponseError(error)
    }
  }
}
