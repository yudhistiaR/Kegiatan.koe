'use client'

import { useState, useEffect } from 'react'
import { clerkClient } from '@/utils/clerk'
import { useParams } from 'next/navigation'

const OrganisasiBanner = () => {
  const { organisasi_name } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = await clerkClient.organizations.getOrganization({
          organizationId: organisasi_name
        })

        console.log(request)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  return <div className="container mx-auto bg-red-500"></div>
}

export default OrganisasiBanner
