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

  async editSumberDanaProker(prokerId, data) {
    const { has, orgId } = await this.clerk()

    const parsingData = await data.json()

    const hasPermissionAccess = has({ feature: 'keuangan' })

    try {
      if (!orgId)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      if (!hasPermissionAccess)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      const getData = await this.keuanganService.editSumberDanaProker(
        prokerId,
        parsingData
      )

      return NextResponse.json(getData, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async deleteSumberDanaProker(sumberId) {
    const { has, orgId } = await this.clerk()

    const hasPermissionAccess = has({ feature: 'keuangan' })

    try {
      if (!orgId)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      if (!hasPermissionAccess)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      const getData =
        await this.keuanganService.deleteSumberDanaProker(sumberId)

      return NextResponse.json(getData, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async addSumberDanaProker(prokerId, data) {
    const { has, orgId } = await this.clerk()

    const parsingData = await data.json()

    const hasPermissionAccess = has({ feature: 'keuangan' })

    try {
      if (!orgId)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      if (!hasPermissionAccess)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      const getData = await this.keuanganService.addSumberDanaProker(
        orgId,
        prokerId,
        parsingData
      )

      return NextResponse.json(getData, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async getPendanaanProkerByProkerId(prokerId) {
    const { has, orgId } = await this.clerk()

    const hasPermissionAccess = has({ feature: 'keuangan' })

    try {
      if (!orgId)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      if (!hasPermissionAccess)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      const getData = await this.keuanganService.getPendanaanProkerId(prokerId)

      return NextResponse.json(getData, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async getPendanaanProkerOrgId(organizationId) {
    const { has, orgId } = await this.clerk()

    const hasPermissionAccess = has({ feature: 'keuangan' })

    try {
      if (orgId !== organizationId)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      if (!hasPermissionAccess)
        NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

      const getData = await this.keuanganService.getPendanaanOrganisasi(orgId)

      return NextResponse.json(getData, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }
}
