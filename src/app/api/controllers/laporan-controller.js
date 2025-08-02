import { ReponseError } from '../errors/ResponseError'
import { NextResponse } from 'next/server'

export class LaporanController {
  constructor(
    organisasiService,
    prokerService,
    rabService,
    tugasService,
    notulenService,
    divisiService,
    clerk
  ) {
    this.organisasiService = organisasiService
    this.prokerService = prokerService
    this.rabService = rabService
    this.tugasService = tugasService
    this.notulenService = notulenService
    this.divisiService = divisiService
    this.clerk = clerk
  }

  async getAnggota(org_id) {
    const { orgId } = await this.clerk()
    try {
      if (orgId !== org_id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }

      const data = await this.organisasiService.organisasiMembers(org_id)
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async getProker(org_id) {
    const { orgId } = await this.clerk()
    try {
      if (orgId !== org_id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }

      const data = await this.prokerService.GET(org_id)
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async getRab(org_id) {
    const { orgId } = await this.clerk()
    try {
      if (orgId !== org_id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }

      const data = await this.rabService.GET_BY_ORG(org_id)
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async getTugas(org_id) {
    const { orgId } = await this.clerk()
    try {
      if (orgId !== org_id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }

      const data = await this.tugasService.GET_BY_ORG(org_id)
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async getTugasPerAnggota(org_id) {
    const { orgId } = await this.clerk()
    try {
      if (orgId !== org_id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }

      const data = await this.tugasService.GET_TASKS_BY_MEMBER(org_id)
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async getNotulensi(org_id) {
    const { orgId } = await this.clerk()
    try {
      if (orgId !== org_id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }

      const data = await this.notulenService.GET_BY_ORG(org_id)
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async getKinerjaDivisi(org_id) {
    const { orgId } = await this.clerk()
    try {
      if (orgId !== org_id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }

      const divisions =
        await this.divisiService.GET_DIVISIONS_WITH_MEMBERS_BY_ORG(org_id)
      const taskCounts =
        await this.tugasService.GET_TASK_COUNTS_BY_DIVISI(org_id)
      const rabTotals = await this.rabService.GET_TOTAL_RAB_BY_DIVISI(org_id)

      const result = divisions.map(divisi => ({
        id: divisi.id,
        name: divisi.name,
        members: divisi.anggota
          .map(member => `${member.user.firstName} ${member.user.lastName}`)
          .join(', '),
        completedTasks: taskCounts[divisi.id]?.DONE || 0,
        pendingTasks: taskCounts[divisi.id]?.PENDING || 0,
        rabUsed: rabTotals[divisi.id] || 0
      }))

      return NextResponse.json(result, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }

  async getStrukturKepanitiaan(org_id) {
    const { orgId } = await this.clerk()
    try {
      if (orgId !== org_id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }

      const data =
        await this.prokerService.GET_WITH_DIVISIONS_AND_MEMBERS(org_id)
      return NextResponse.json(data, { status: 200 })
    } catch (error) {
      return ReponseError(error)
    }
  }
}
