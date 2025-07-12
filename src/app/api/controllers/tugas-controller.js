import { NextResponse } from 'next/server'
import { ReponseError } from '../errors/ResponseError'

export class TugasController {
  constructor(tugasservice, clerk, validation, schema) {
    this.tugasService = tugasservice
    this.clerk = clerk
    this.validation = validation
    this.schema = schema
  }

  async GET(divisi_id, proker_id) {
    try {
      const res = await this.tugasService.GET(divisi_id, proker_id)
      return NextResponse.json(res, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async CREATE(req) {
    const data = await req.json()

    try {
      const res = await this.tugasService.CREATE(data)

      return NextResponse.json(res, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async DELETE(req) {
    const data = await req.json()

    try {
      const res = await this.tugasService.DELETE(data)

      return NextResponse.json(res, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async UPDATE(req) {
    const data = await req.json()

    try {
      //const validBody = this.validation.validate(this.schema.UPDATE, data)

      const res = await this.tugasService.UPDATE(data)

      return NextResponse.json(res, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async UPDATES(req) {
    const data = await req.json()

    try {
      await this.tugasService.UPDATES(data)

      return NextResponse.json({ message: 'OK!!!' }, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }
}
