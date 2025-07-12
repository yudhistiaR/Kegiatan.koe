import { ReponseError } from '../errors/ResponseError'
import { NextResponse } from 'next/server'

export class DivisiController {
  constructor(divisiService, clerk, validation, schema) {
    this.divisiService = divisiService
    this.clerk = clerk
    this.validation = validation
    this.schema = schema
  }

  async GETBYID(divisi_id) {
    try {
      if (!divisi_id)
        NextResponse.json({ message: 'divisi id not defaind' }, { status: 404 })

      const res = await this.divisiService.GETBYID(divisi_id)

      return NextResponse.json(res, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async GET(org_id, proker_id) {
    const { orgId } = await this.clerk()

    try {
      const validBody = this.validation.validate(this.schema.GETID, {
        org_id,
        proker_id
      })

      if (orgId !== org_id)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      const res = await this.divisiService.GET(validBody)

      return NextResponse.json(res, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async CREATE(req) {
    try {
      const body = await req.json()
      const validBody = this.validation.validate(this.schema.CREATE, body)
      const res = await this.divisiService.CREATE(validBody)
      return NextResponse.json({ message: res }, { satus: 201 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async addDivisiMember(req) {
    try {
      const body = await req.json()
      const { members } = body

      if (members.length <= 0)
        return NextResponse.json(
          { message: 'user id not defaind' },
          { status: 400 }
        )

      await this.divisiService.addDivisiMember(body)

      return NextResponse.json({ message: 'ok' }, { satus: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async DELETE(org_id, proker_id, divisi_id) {
    const { orgId } = await this.clerk()
    try {
      if (orgId !== org_id)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      if (!proker_id && !divisi_id)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      const validBody = this.validation.validate(this.schema.GETIDS, {
        org_id,
        proker_id,
        divisi_id
      })

      await this.divisiService.DELETE(validBody)

      return NextResponse.json({ message: 'OK!!!' }, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }
}
