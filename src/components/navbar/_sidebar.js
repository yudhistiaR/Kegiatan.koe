'use client'

//Hooks
import { useState, Fragment } from 'react'
import { usePathname } from 'next/navigation'

//Components
import { MainLogo, Logo } from '../Logo'
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
  Logs,
  Settings,
  Target,
  FileSearchIcon,
  HandCoins
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

const SidebarMenu = ({ open }) => {
  const { orgSlug, orgId, isLoaded, has } = useAuth()

  return (
    <ul className="w-full h-full flex flex-col gap-2 overflow-y-scroll py-4 px-2 no-scrollbar">
      {menu.map((el, i) => {
        if (el.name === 'Laporan' && !has({ role: 'org:ketua' })) return null
        return (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              {isLoaded && (
                <li>
                  <Link
                    href={`/${orgId ? orgSlug : 'tamu'}/${el.path}`}
                    className={`w-full px-4 py-2 bg-accentColor rounded-md hover:bg-accentColor/50 transition-all duration-200 flex items-center gap-2 text-md font-bold ${open ? 'justify-start' : 'justify-center'}`}
                  >
                    <div>{el.icon}</div>
                    {open ? <div>{el.name}</div> : null}
                  </Link>
                </li>
              )}
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className={`shadow-md font-semibold ${open ? 'hidden' : 'w-full'}`}
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
  const { orgSlug, isLoaded } = useAuth()

  const pathname = usePathname().split('/').slice(1)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <main className="flex min-h-screen overflow-hidden">
      {isLoaded ? (
        <>
          {/* Aside */}
          <aside className="max-h-screen bg-foreground border-r border-r-zinc-500 flex flex-col justify-between">
            <div
              className={`flex items-center justify-start min-h-14 border-b border-b-zinc-500 p-2 ${open ? 'w-60' : 'w-20'} transition-all duration-200`}
            >
              {/* Aside Logo */}
              {open ? <MainLogo /> : <Logo />}
            </div>
            {/* Aside Content */}
            <SidebarMenu open={open} />
            {/* Aside Footer */}
            <div className="p-2">
              <button
                onClick={handleClick}
                className="w-full min-h-10 cursor-pointer flex items-center justify-center rounded-md hover:bg-zinc-500/50 transition-colors duration-200"
              >
                <PanelRightOpen size={20} />
              </button>
            </div>
          </aside>
          <div className="w-full max-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="h-14 py-2 px-4 border-b border-b-zinc-500 bg-foreground flex items-center justify-between">
              <div className="text-lg md:text-lg font-bold">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>{orgSlug?.toUpperCase()}</BreadcrumbItem>
                    {pathname?.map((el, i) => (
                      <Fragment key={i}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem className="capitalize">
                          {el}
                        </BreadcrumbItem>
                      </Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <OrganizationSwitcher
                    hidePersonal
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
            {/* Content */}
            <section className="ml-4 mt-4 p-4 rounded-tl-xl shadow-lg bg-foreground overflow-y-scroll h-full">
              {children}
            </section>
          </div>
        </>
      ) : (
        // You can add a loading spinner or skeleton here if needed
        <div>Loading...</div>
      )}
    </main>
  )
}

export default Sidebar
