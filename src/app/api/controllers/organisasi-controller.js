import { NextResponse } from 'next/server'
import { ReponseError } from '../errors/ResponseError'

export class OrganisasiController {
  constructor(organisasiService, clerk, validation, validationSchema) {
    this.organisasiService = organisasiService
    this.clerk = clerk
    this.validation = validation
    this.validationSchema = validationSchema
  }

  async getOrganisasiMembers(org_id) {
    const { orgId } = await this.clerk()

    try {
      if (orgId !== org_id)
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      const data = await this.organisasiService.organisasiMembers(orgId)

      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }
}
