'use client'

//Hooks
import { useState, Fragment } from 'react'
import { usePathname } from 'next/navigation'
import { TooltipProvider } from '@/components/ui/tooltip'
import Image from 'next/image'

//Components
import { MainLogo, Logo } from '@/components/Logo'
import {
  useAuth,
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from '@clerk/nextjs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import Link from 'next/link'

//icons
import {
  PanelRightOpen,
  LayoutDashboard,
  LogInIcon as Logs,
  Settings,
  Target,
  FileSearchIcon,
  HandCoins,
  Menu,
  X
} from 'lucide-react'

const menu = [
  {
    path: 'dashboard',
    name: 'Dashboard',
    icon: <LayoutDashboard />
  },
  {
    path: 'proker',
    name: 'Program Kerja',
    icon: <Target />
  },
  {
    path: 'me/tugas',
    name: 'Tugas',
    icon: <Logs />
  },
  {
    path: 'keuangan',
    name: 'Keuangan',
    icon: <HandCoins />
  },
  {
    path: 'laporan',
    name: 'Laporan',
    icon: <FileSearchIcon />
  },
  {
    path: 'setting/profile',
    name: 'Settings',
    icon: <Settings />
  }
]

const SidebarMenu = ({ open, onItemClick }) => {
  const { orgSlug, orgId, isLoaded, has } = useAuth()
  const pathname = usePathname()

  return (
    <ul className="w-full h-full flex flex-col gap-2 overflow-y-scroll py-4 px-2 no-scrollbar">
      {menu.map((el, i) => {
        if (el.name === 'Laporan' && !has({ role: 'org:ketua' })) return null

        const isActive = pathname.includes(el.path)

        return (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              {isLoaded && (
                <li>
                  <Link
                    href={`/${orgId ? orgSlug : 'tamu'}/${el.path}`}
                    onClick={onItemClick}
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 text-sm font-medium group relative overflow-hidden ${
                      open ? 'justify-start' : 'justify-center'
                    } ${
                      isActive
                        ? 'bg-[oklch(56.95%_0.165_266.79)] text-white shadow-lg'
                        : 'text-gray-300 hover:bg-[oklch(56.95%_0.165_266.79)]/20 hover:text-white'
                    }`}
                  >
                    <div
                      className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                    >
                      {el.icon}
                    </div>
                    {open && (
                      <div className="transition-all duration-200 group-hover:translate-x-1">
                        {el.name}
                      </div>
                    )}
                    {isActive && (
                      <div className="absolute inset-0 bg-[oklch(56.95%_0.165_266.79)]/10 rounded-lg blur-sm -z-10" />
                    )}
                  </Link>
                </li>
              )}
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className={`shadow-lg font-medium bg-[oklch(27.27%_0.056_276.3)] border-[oklch(56.95%_0.165_266.79)]/20 text-white ${open ? 'hidden' : 'block'}`}
            >
              <div>{el.name}</div>
            </TooltipContent>
          </Tooltip>
        )
      })}
    </ul>
  )
}

const Sidebar = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { orgSlug, isLoaded } = useAuth()

  const pathname = usePathname().split('/').slice(1)

  const handleClick = () => {
    setOpen(!open)
  }

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleMobileItemClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <main className="flex min-h-screen overflow-hidden bg-[oklch(29.46%_0.06_276.82)]">
      {isLoaded ? (
        <>
          <aside className="hidden lg:flex max-h-screen bg-[oklch(27.27%_0.056_276.3)] border-r border-[oklch(56.95%_0.165_266.79)]/20 flex-col justify-between shadow-xl">
            <div
              className={`flex items-center justify-start min-h-16 border-b border-[oklch(56.95%_0.165_266.79)]/20 p-3 ${
                open ? 'w-64' : 'w-20'
              } transition-all duration-300 ease-in-out`}
            >
              <div className="transition-all duration-300">
                {open ? <MainLogo /> : <Logo />}
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <SidebarMenu open={open} onItemClick={() => {}} />
            </div>

            <div className="p-3 border-t border-[oklch(56.95%_0.165_266.79)]/20">
              <button
                onClick={handleClick}
                className="w-full min-h-12 cursor-pointer flex items-center justify-center rounded-lg hover:bg-[oklch(56.95%_0.165_266.79)]/20 transition-all duration-200 text-gray-300 hover:text-white group"
              >
                <PanelRightOpen
                  size={20}
                  className={`transition-transform duration-300 ${open ? 'rotate-180' : ''} group-hover:scale-110`}
                />
              </button>
            </div>
          </aside>

          {mobileMenuOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
              onClick={handleMobileMenuToggle}
            >
              <aside className="w-64 h-full bg-[oklch(27.27%_0.056_276.3)] border-r border-[oklch(56.95%_0.165_266.79)]/20 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between min-h-16 border-b border-[oklch(56.95%_0.165_266.79)]/20 p-3">
                  <MainLogo />
                  <button
                    onClick={handleMobileMenuToggle}
                    className="p-2 rounded-lg hover:bg-[oklch(56.95%_0.165_266.79)]/20 text-gray-300 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-hidden">
                  <SidebarMenu
                    open={true}
                    onItemClick={handleMobileItemClick}
                  />
                </div>
              </aside>
            </div>
          )}

          <div className="w-full max-h-screen flex flex-col">
            <nav className="h-16 py-3 px-4 sm:px-6 border-b border-[oklch(56.95%_0.165_266.79)]/20 bg-[oklch(27.27%_0.056_276.3)] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleMobileMenuToggle}
                  className="lg:hidden p-2 rounded-lg hover:bg-[oklch(56.95%_0.165_266.79)]/20 text-gray-300 hover:text-white"
                >
                  <Menu size={20} />
                </button>

                <div className="text-sm sm:text-lg font-semibold text-white">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="text-[oklch(56.95%_0.165_266.79)] font-bold">
                        {orgSlug?.toUpperCase()}
                      </BreadcrumbItem>
                      {pathname?.map((el, i) => (
                        <Fragment key={i}>
                          <BreadcrumbSeparator className="text-gray-400" />
                          <BreadcrumbItem className="capitalize text-gray-300 hidden sm:block">
                            {el}
                          </BreadcrumbItem>
                        </Fragment>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="[&>div]:bg-[oklch(29.46%_0.06_276.82)] [&>div]:border-[oklch(56.95%_0.165_266.79)]/20 hidden sm:block">
                  <OrganizationSwitcher
                    afterLeaveOrganizationUrl={`/:slug/dashboard`}
                    afterCreateOrganizationUrl={`/:slug/dashboard`}
                    afterSelectOrganizationUrl={`/:slug/dashboard`}
                  />
                </div>
                <div>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton />
                  </SignedOut>
                </div>
              </div>
            </nav>

            <section className="flex-1 m-2 sm:m-4 p-3 sm:p-6 rounded-xl shadow-lg bg-[oklch(27.27%_0.056_276.3)] overflow-y-auto border border-[oklch(56.95%_0.165_266.79)]/10">
              {children}
            </section>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen w-full">
          <div className="flex flex-col items-center justify-center text-sm font-semibold">
            <Image
              src="/logo.svg"
              width={100}
              height={80}
              alt="logo"
              className="animate-pulse"
            />
            <p>Loading...</p>
            <p className="text-zinc-300">Organizational management solutions</p>
          </div>
        </div>
      )}
    </main>
  )
}

const SidebarWithTooltipProvider = ({ children }) => {
  return (
    <TooltipProvider>
      <Sidebar>{children}</Sidebar>
    </TooltipProvider>
  )
}

export default SidebarWithTooltipProvider
