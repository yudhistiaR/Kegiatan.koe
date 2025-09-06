import { ReponseError } from '../errors/ResponseError'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export class ProkerController {
  constructor(prokerService, clerk, errorCode, validation, schema) {
    this.prokerService = prokerService
    this.clerk = clerk
    this.errorCode = errorCode
    this.validation = validation
    this.schema = schema
  }

  async GET() {
    const { orgId } = await auth()

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
      //const validBody = this.validation.validate(this.schema.CREATE, body)
      const res = await this.prokerService.CREATE(body)
      return NextResponse.json(res, { status: 201 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  /**
   * Menghapus 1 proker
   * @param {string} orgId memeerlukan organisasi id dari client
   * @param {uuid} prokerId memeerlukan proker id dari client
   *
   * Aturan :
   * Perlu prokerId
   * */
  async DELETE(orgId, prokerId) {
    try {
      if (!prokerId || !orgId) {
        return NextResponse.json(this.errorCode['BAD_REQUEST'])
      }

      const proker = await this.prokerService.getProker(orgId, prokerId)

      if (!proker || proker.length === 0) {
        return NextResponse.json(this.errorCode['DATA_NOT_FOUND'].Error, {
          status: this.errorCode['DATA_NOT_FOUND'].status
        })
      }

      await this.prokerService.deleteProker(orgId, prokerId)

      return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  /**
   * update proker
   * @param {uuid} prokerId memeerlukan proker id dari client
   * @param {uuid} orgId memeerlukan organisasi id dari client
   * @param {json} data memeerlukan data edit dari client
   *
   * Aturan :
   * Perlu prokerId
   * */
  async UPDATE(orgId, prokerId, data) {
    try {
      const parseData = await data.json()

      if (!prokerId || !orgId) {
        return NextResponse.json(this.errorCode['BAD_REQUEST'])
      }

      const proker = await this.prokerService.getProker(orgId, prokerId)

      if (!proker || proker.length === 0) {
        return NextResponse.json(this.errorCode['DATA_NOT_FOUND'].Error, {
          status: this.errorCode['DATA_NOT_FOUND'].status
        })
      }

      await this.prokerService.updateProker(orgId, prokerId, parseData)

      return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }
}
