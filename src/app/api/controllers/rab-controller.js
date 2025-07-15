import { ReponseError } from '../errors/ResponseError'
import { NextResponse } from 'next/server'

export class RabController {
  constructor(rabService, clerk, validation, schema) {
    this.rabService = rabService
    this.clerk = clerk
    this.validation = validation
    this.schema = schema
  }

  async GETALL() {
    try {
      const data = await this.rabService.GETALL()
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async GET(id) {
    try {
      const data = await this.rabService.GET(id)
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async CREATE(data) {
    const parseData = await data.json()

    try {
      const data = await this.rabService.CREATE(parseData)
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async DELETE(id) {
    try {
      const data = await this.rabService.DELETE(id)
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }
}
