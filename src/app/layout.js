import './globals.css'

//Context
import { SidebarProvider } from '@/contexts/SidebarContext'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/contexts/ThemeContext'

export const metadata = {
  title: 'Kegiatan.koe',
  description:
    'Aplikasi manajement anggota dan manajement kegiatan organisasi mahasiswa'
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="id">
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
