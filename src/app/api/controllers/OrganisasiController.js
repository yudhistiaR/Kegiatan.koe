import { NextResponse } from 'next/server'
import { OrganisasiService } from '../services/OrganisasiService'

export class OrganisasiController {
  static async GETID() {
    try {
      const request = await OrganisasiService.GETID()

      return NextResponse.json({ request, status: 200 })
    } catch (error) {
      return NextResponse.json({ error, status: 500 })
    }
  }
}
