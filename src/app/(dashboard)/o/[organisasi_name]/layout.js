'use client'

import { useUser } from '@clerk/nextjs'
import { useOrganizationList } from '@clerk/nextjs'
import { useOrganization } from '@clerk/nextjs'

const OrganisasiLayout = ({ children }) => {
  const { userMemberships, userSuggestions } = useOrganizationList()

  return (
    <div>
      <div>{children}</div>
    </div>
  )
}

export default OrganisasiLayout
