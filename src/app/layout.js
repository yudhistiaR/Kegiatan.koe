import { Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/utils'

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
})

export const metadata = {
  title: 'Kegiatan.koe',
  description: 'Aplikasi manajement tugas kegiatan dan manajement dana kegiatan'
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
