import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from '@clerk/nextjs'

export function PageLayout({ children, currentPage }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-[#3d4166] bg-[#2d3154]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/logo.svg"
                    alt="Kegiatan_logo"
                    width={35}
                    height={35}
                  />
                </div>
                <span className="text-xl font-bold text-white">
                  Kegiatan.koe
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <SignedIn>
                <Link
                  href="/tamu/dashboard"
                  className={`transition-colors ${currentPage === 'features' ? 'text-accentColor font-medium' : 'text-gray-300 hover:text-white'}`}
                >
                  Dashboard
                </Link>
              </SignedIn>
              <Link
                href="/why-free"
                className={`transition-colors ${currentPage === 'mengapa-gratis' ? 'text-accentColor font-medium' : 'text-gray-300 hover:text-white'}`}
              >
                Mengapa Gratis
              </Link>
              <Link
                href="/tentang-kami"
                className={`transition-colors ${currentPage === 'tentang-kami' ? 'text-accentColor font-medium' : 'text-gray-300 hover:text-white'}`}
              >
                Tentang Kami
              </Link>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <Link
                  href="/sign-in"
                  className={`${buttonVariants({ variant: 'outline', size: 'sm' })} "border-accentColor text-white hover:bg-[#4b6fd7] bg-transparent"`}
                >
                  Masuk
                </Link>
              </SignedOut>
              <SignedOut>
                <Link
                  href="/sign-up"
                  className={`${buttonVariants({ size: 'sm' })} "bg-accentColor hover:bg-[#3d5bc7] text-white"`}
                >
                  Mulai Sekarang - Gratis!
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="bg-[#1a1d35] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/logo.svg"
                    alt="Kegiatan_logo"
                    width={35}
                    height={35}
                  />
                </div>
                <span className="text-xl font-bold">Kegiatan.koe</span>
              </div>
              <p className="text-gray-400">
                Platform manajemen organisasi terpadu untuk tim yang lebih
                produktif.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Produk</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/#features"
                    className="hover:text-white transition-colors"
                  >
                    Fitur
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Dukungan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Dokumentasi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Tutorial
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Perusahaan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/tentang-kami"
                    className="hover:text-white transition-colors"
                  >
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mengapa-gratis"
                    className="hover:text-white transition-colors"
                  >
                    Mengapa Gratis
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Kegiatan.koe. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
