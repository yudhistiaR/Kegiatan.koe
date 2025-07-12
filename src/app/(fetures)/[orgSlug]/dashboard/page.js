'use client'

import { useAuth } from '@clerk/nextjs'

const DashboardPage = () => {
  const { orgId, orgSlug } = useAuth()

  return (
    <>
      <h1>DashboardPage</h1>
      <h2>{orgId}</h2>
      <h2>{orgSlug}</h2>
    </>
  )
}

export default DashboardPage
