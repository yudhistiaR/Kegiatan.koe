import { clerk } from '@/utils/clerk'

export class OrganisasiService {
  static async GETID() {
    return await clerk.organizations.getOrganization()
  }
}
