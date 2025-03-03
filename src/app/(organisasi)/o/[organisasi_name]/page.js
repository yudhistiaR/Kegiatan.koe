'use client'

import { useParams } from 'next/navigation'
import { OrganizationList } from '@clerk/nextjs'
import { useClerk } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

const OrganisasiPage = () => {
  const { organisasi_name } = useParams()
  const { clerk, loaded } = useClerk()

  const [datas, setDatas] = useState([])

  useEffect(() => {
    const fetchdata = async () => {
      try {
        if (!clerk || !loaded) return
        const request = await clerk.getOrganization(organisasi_name)

        console.log(request)

        setDatas(request)
      } catch (error) {
        console.log(error)
      }
    }

    fetchdata()
  }, [clerk, loaded])

  console.log(organisasi_name)
  console.log(datas)

  return <OrganizationList />
}

export default OrganisasiPage
