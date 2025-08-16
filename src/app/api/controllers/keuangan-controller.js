import { NextResponse } from 'next/server'
import { ReponseError } from '../errors/ResponseError'

export class KeuanganController {
  constructor(keuanganService, clerk, validation, schema) {
    this.keuanganService = keuanganService
    this.clerk = clerk
    this.validation = validation
    this.schema = schema
  }

  async getByOrgId(organizationId) {
    const { has, orgId } = await this.clerk()

    const hasPermissionAccess = has({ feature: 'keuangan' })

    try {
      if (orgId !== organizationId)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      if (!hasPermissionAccess)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      const getData = await this.keuanganService.getByOrgId(orgId)

      return NextResponse.json(getData, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }
}
