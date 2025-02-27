'use client'

import Logo from './commont/Logo'
import ThemeToggleButton from './commont/ThemeToggleButton'
import { FaChevronDown } from 'react-icons/fa'
import { useState } from 'react'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

const Navbar = () => {
  const [dropMenu, setDropMenu] = useState(false)

  const handdleButtonNavClick = () => {
    setDropMenu(!dropMenu)
  }

  const ToggleNavButton = () => {
    return (
      <div>
        <button
          onClick={handdleButtonNavClick}
          className={`nav-button ${dropMenu ? 'menu-active' : ''}`}
        >
          <span>Organisasi</span>
          <FaChevronDown className="ml-auto" />
        </button>
        {dropMenu ? <NavMenu /> : null}
      </div>
    )
  }

  const NavMenu = () => (
    <ul className="text-theme-sm font-bold absolute w-[250px] top-14 z-99 bg-white dark:bg-primary-200 p-4 shadow-md flex flex-col space-y-4">
      <p>Organisasi Ku</p>
      <li>
        <button className="w-full hover:bg-zinc-500/[0.12] transition-all duration-200 text-primary-100 px-2 py-3 flex items-center gap-2 relative  dark:text-white">
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
          <span>Organisasi A</span>
          <FaChevronDown
            className={`ml-auto h-5 w-5 transition-transform transform-gpu duration-200`}
          />
        </button>
      </li>
      <li>
        <button className="w-full hover:bg-zinc-500/[0.12] transition-all duration-200 text-primary-100 px-2 py-3 flex items-center gap-2 relative  dark:text-white">
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
          <span>Organisasi B</span>
          <FaChevronDown
            className={`ml-auto h-5 w-5 transition-transform transform-gpu duration-200`}
          />
        </button>
      </li>
      <li>
        <button className="w-full hover:bg-zinc-500/[0.12] transition-all duration-200 text-primary-100 px-2 py-3 flex items-center gap-2 relative  dark:text-white">
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
          <span>Organisasi C</span>
          <FaChevronDown
            className={`ml-auto h-5 w-5 transition-transform transform-gpu duration-200`}
          />
        </button>
      </li>
    </ul>
  )

  return (
    <nav className="border-b-2 border-line w-full py-2 flex items-center bg-white dark:bg-primary-100">
      <div className="container mx-auto flex items-center justify-between w-full h-full px-6 md:px-0">
        <div className="flex items-center gap-5">
          <Logo />
          <ToggleNavButton />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggleButton />

          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
