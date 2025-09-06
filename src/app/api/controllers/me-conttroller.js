import { NextResponse } from 'next/server'
import { ReponseError } from '../errors/ResponseError'

export class MeController {
  constructor(meService, clerk, errorCode, validation, schema) {
    this.service = meService
    this.clerk = clerk
    this.errorCode = errorCode
    this.validation = validation
    this.schema = schema
  }

  /**
   * @param {string} - perlu user id
   *
   * Aturan :
   * id tidak boleh kosong
   * Error Status :
   * tidak ada id -> BAD_REQUEST
   * data tidak ditemukan -> DATA_NOT_FOUND
   * */
  async GETME(id) {
    try {
      if (!id) {
        return NextResponse.json(this.errorCode['BAD_REQUEST'])
      }

      const res = await this.service.GETME(id)

      if (!res || res.length === 0) {
        return NextResponse.json(this.errorCode['DATA_NOT_FOUND'])
      }

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
