'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function OrientationWrapper({ children }) {
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.matchMedia('(orientation: portrait)').matches
      setIsPortrait(portrait)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
    }
  }, [])

  return (
    <div className="relative min-h-screen">
      {children}
      {isPortrait && (
        <div className="fixed h-screen inset-0 flex items-center justify-center z-[9999] bg-accentColor">
          <div className="text-white text-center p-4">
            <Image
              alt="image_rotation"
              src="/orientation.png"
              width={120}
              height={120}
              className="mb-4 m-auto"
            />
            <h1>Rotatsi ponsel anda untuk pengalaman yang lebih baik</h1>
            <p className="absolute left-0 bottom-8 text-center m-5">
              Tolonga nyalakan Screen Rotation dan coba gunakan browser lain
              jika halaman tidak menampilkan apapun
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
