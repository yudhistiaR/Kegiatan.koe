'use client'

import { useState, useEffect, createContext, useContext } from 'react'

const SidebarContext = createContext(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('ContextProvider harus di difinisikan')
  }

  return context
}

export const SidebarProvider = ({ children }) => {
  const [active, setActive] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [isMobile, setIsMobile] = useState(null)

  useEffect(() => {
    const handlerMobileMenu = () => {
      if (window.innerWidth <= 660) {
        setMobile(true)
      }
    }

    return () => {
      handlerMobileMenu()
    }
  }, [])

  const handlerToggle = () => {
    setActive(!active)
  }

  return (
    <SidebarContext.Provider
      value={{ active, mobile, setActive, setMobile, handlerToggle }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
