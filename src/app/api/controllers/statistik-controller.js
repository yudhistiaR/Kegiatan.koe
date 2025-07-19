import { ReponseError } from '../errors/ResponseError'
import { NextResponse } from 'next/server'

export class StatistikController {
  constructor(statistikService, clerk, validation, schema) {
    this.statistikService = statistikService
    this.clerk = clerk
    this.validation = validation
    this.schema = schema
  }

  async dashboardSatistik(org_id) {
    try {
      const res = await this.statistikService.dashboardStatistik(org_id)
      return NextResponse.json(res, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }
}
