'use client'

import { useState, useEffect } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

const MainAside = () => {
  const [active, setActive] = useState(null)
  const [ormawa, setOrmawa] = useState([])

  const { user, isLoaded } = useUser()

  useEffect(() => {
    const fetchdata = async () => {
      try {
        if (!isLoaded || !user) return

        const request = await user.getOrganizationMemberships()
        setOrmawa(request)
      } catch (error) {
        console.log(error)
      }
    }

    fetchdata()
  }, [user, isLoaded])

  const handleMenuClick = idx => {
    setActive(active === idx ? null : idx)
  }

  const ListOrmawaMenu = () => {
    return (
      <ul className="flex flex-col gap-4 text-theme-xs">
        {ormawa?.data?.map((item, idx) => (
          <li key={idx}>
            <button
              onClick={() => handleMenuClick(idx)}
              className="w-full hover:bg-zinc-500/[0.12] transition-all duration-200 text-primary-100 px-2 py-3 flex items-center gap-2 relative  dark:text-white"
            >
              <span>
                <Image
                  alt="logo-organisasi"
                  width={25}
                  height={25}
                  src={item.organization.imageUrl}
                />
              </span>
              <span>{item.organization.name}</span>
              <FaChevronDown
                className={`ml-auto h-5 w-5 transition-transform transform-gpu duration-200 ${active === idx ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>
            <span>
              {active === idx ? (
                <ul className="flex flex-col px-2  py-4 gap-4 text-md">
                  <Link
                    href={`/o/${item.organization.id}/home`}
                    className="hover:bg-zinc-500/[0.12] ml-7 py-3 px-2"
                  >
                    Kegiatan
                  </Link>
                  <Link
                    href={`/o/${item.organization.id}/view`}
                    className="hover:bg-zinc-500/[0.12] ml-7 py-3 px-2"
                  >
                    Tampilan
                  </Link>
                  <Link
                    href={`/o/${item.organization.id}/member`}
                    className="hover:bg-zinc-500/[0.12] ml-7 py-3 px-2"
                  >
                    Anggota
                  </Link>
                  <Link
                    href={`/o/${item.organization.id}/setting`}
                    className="hover:bg-zinc-500/[0.12] ml-7 py-3 px-2"
                  >
                    Pengaturan
                  </Link>
                </ul>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <aside className="w-[280px] h-full overflow-y-scroll no-scrollbar dark:text-white">
      <ul className="border-b-2 border-line pb-5 text-theme-xs">
        <li>Home</li>
        <li>Kegiatan</li>
      </ul>
      <div className="flex flex-col">
        <div className="w-full flex items-center justify-between">
          <p className="py-4">Organisasi</p>
          <p>{ormawa.total_count}</p>
        </div>
        <ListOrmawaMenu />
      </div>
    </aside>
  )
}

export default MainAside
