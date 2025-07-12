'use clinet'

import { useState, useEffect } from 'react'

const SMALL = 600 //Extra small mobile
const MEDIUM = 768 //Small mobile
const LARGE = 992 //Medium mobile > desktop

const DEVICE_SIZES = {
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
  EXTRA_LARGE: 'EXTRA_LARGE'
}

export const useDeviceSize = () => {
  const [deviceSize, setDeviceSize] = useState(null)
  const [deviceWidth, setDeviceWidth] = useState(null)

  useEffect(() => {
    if (typeof window !== undefined) {
      const handleResize = () => {
        setDeviceWidth(window.innerWidth)
        if (window.innerWidth <= SMALL) {
          setDeviceSize(DEVICE_SIZES.SMALL)
        } else if (window.innerWidth <= MEDIUM) {
          setDeviceSize(DEVICE_SIZES.MEDIUM)
        } else if (window.innerWidth <= LARGE) {
          setDeviceSize(DEVICE_SIZES.LARGE)
        } else {
          setDeviceSize(DEVICE_SIZES.EXTRA_LARGE)
        }
      }

      window.addEventListener('resize', handleResize)

      return () => {
        widnow.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return {
    deviceSize,
    deviceWidth
  }
}
