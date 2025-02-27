'use client'

import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

const ormawaList = [
  {
    name: 'HMP-SI'
  },
  {
    name: 'BEM'
  },
  {
    name: 'DPM'
  },
  {
    name: 'DPK'
  }
]

const MainAside = () => {
  const [active, setActive] = useState(null)

  const handleMenuClick = idx => {
    setActive(active === idx ? null : idx)
  }

  const ListOrmawaMenu = () => {
    return (
      <ul className="flex flex-col gap-4 text-theme-xs">
        {ormawaList.map((item, idx) => (
          <li key={idx}>
            <button
              onClick={() => handleMenuClick(idx)}
              className="w-full hover:bg-zinc-500/[0.12] transition-all duration-200 text-primary-100 px-2 py-3 flex items-center gap-2 relative  dark:text-white"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 50 50"
                >
                  <path d="M 0 4 L 0 46 L 50 46 L 50 4 Z M 2 6 L 48 6 L 48 44 L 2 44 Z M 4 8 L 4 30.6875 L 17.3125 18.28125 C 17.507813 18.097656 17.769531 17.972656 18.03125 18 C 18.296875 18.011719 18.570313 18.117188 18.75 18.3125 L 29.03125 29.5625 L 33.28125 25.28125 C 33.671875 24.890625 34.328125 24.890625 34.71875 25.28125 L 46 36.59375 L 46 8 Z M 35 15 C 36.65625 15 38 16.34375 38 18 C 38 19.65625 36.65625 21 35 21 C 33.34375 21 32 19.65625 32 18 C 32 16.34375 33.34375 15 35 15 Z M 17.9375 20.40625 L 4 33.4375 L 4 42 L 46 42 L 46 39.40625 L 34 27.40625 L 26.40625 35 L 23.59375 35 L 27.625 30.96875 Z"></path>
                </svg>
              </span>
              <span>{item.name}</span>
              <FaChevronDown
                className={`ml-auto h-5 w-5 transition-transform transform-gpu duration-200 ${active === idx ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>
            <span>
              {active === idx ? (
                <ul className="flex flex-col px-2  py-4 gap-4 text-md">
                  <li className="hover:bg-zinc-500/[0.12] ml-7 py-3 px-2">
                    Kegiatan
                  </li>
                  <li className="hover:bg-zinc-500/[0.12] ml-7 py-3 px-2">
                    Tampilan
                  </li>
                  <li className="hover:bg-zinc-500/[0.12] ml-7 py-3 px-2">
                    Anggota
                  </li>
                  <li className="hover:bg-zinc-500/[0.12] ml-7 py-3 px-2">
                    Pengaturan
                  </li>
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
      <ul className="flex flex-col gap-5 border-b-2 border-line pb-5 text-theme-xs">
        <li>Home</li>
        <li>Kegiatan</li>
      </ul>
      <div>
        <p className="py-4">Organisasi</p>
        <ListOrmawaMenu />
      </div>
    </aside>
  )
}

export default MainAside
