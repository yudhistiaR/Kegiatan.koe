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
      const { orgId } = this.clerk()

      const data = await this.rabService.GETALL(orgId)
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async UPDATEREVISISTATUS(data) {
    try {
      const parseData = await data.json()

      const response = await this.rabService.updateRevisiStatus(parseData)
      return NextResponse.json(response, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async UPDATERABSTATUS(data) {
    try {
      const parseData = await data.json()

      const response = await this.rabService.updateRabStatus(parseData)
      return NextResponse.json(response, { status: 200 })
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

  async CREATE(data, divisiId) {
    const parseData = await data.json()

    try {
      const data = await this.rabService.CREATE(parseData, divisiId)
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
