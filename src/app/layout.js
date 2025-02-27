import './globals.css'

//Context
import { ThemeContext } from '@/contexts/ThemeContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata = {
  title: 'Kegiatan.koe',
  description:
    'Aplikasi manajement anggota dan manajement kegiatan organisasi mahasiswa'
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <ThemeContext attribute="class">
          <SidebarProvider>
            <body>{children}</body>
          </SidebarProvider>
        </ThemeContext>
      </html>
    </ClerkProvider>
  )
}
