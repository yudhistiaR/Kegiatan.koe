'use client'

import { FaChevronLeft } from 'react-icons/fa'
import { useSidebar } from '@/contexts/SidebarContext'

const Sidebar = () => {
  const { active, handlerToggle } = useSidebar()

  return (
    <aside
      className={`fixed z-50 w-[290px] drak:bg-primary-200 h-full border-r border-line px-4 transition-all duration-300
                  ${active ? 'translate-x-0' : '-translate-x-[270px]'}
      `}
    >
      <button
        onClick={handlerToggle}
        className="h-10 w-10 flex items-center justify-center rounded-full absolute -right-5 top-5 z-999 bg-primary-300 text-white"
      >
        <FaChevronLeft />
      </button>

      <ul className="flex flex-col gap-4 mt-8">
        <li className="flex items-center w-full justify-between">
          <button>ORGANISASI A</button>
        </li>
        <li>Kegiatan</li>
        <li>Pengumuman</li>
        <li>kanban</li>
      </ul>
    </aside>
  )
}

export default Sidebar
