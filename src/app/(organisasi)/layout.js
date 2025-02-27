'use client'

import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Aside/OrganisasiAside'
import { useSidebar } from '@/contexts/SidebarContext'

const OrganisasiLayout = ({ children }) => {
  const { active } = useSidebar()

  const contentMargin = active ? 'ml-[290px]' : ''

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="sticky top-0 z-9999">
        <Navbar />
      </header>
      <main className="flex transition-all duration-300">
        <Sidebar />
        <section
          className={`flex-1 max-w-screen-2xl mx-auto md:p-6 ${contentMargin}`}
        >
          {children}
        </section>
      </main>
    </div>
  )
}

export default OrganisasiLayout
