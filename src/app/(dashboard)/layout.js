import Navbar from '@/components/Navbar'
import MainAside from '@/components/Aside/MainAside'

const DashboardLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="sticky top-0 z-9999">
        <Navbar />
      </header>
      <main className="flex h-full container mx-auto mt-8">
        <MainAside />
        <section className={`flex-1 max-w-screen-2xl mx-auto md:p-6`}>
          {children}
        </section>
      </main>
    </div>
  )
}

export default DashboardLayout
