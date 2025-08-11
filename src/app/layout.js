import { Poppins } from 'next/font/google'
import './globals.css'

//Providers
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from '@/lib/utils'
import { shadesOfPurple } from '@clerk/themes'

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
    <ClerkProvider
      appearance={{
        baseTheme: shadesOfPurple,
        variables: {
          colorForeground: '#ffffff',
          colorBackground: '#202442',
          colorMuted: '#25294a'
        },
        signIn: {
          variables: {
            colorForeground: '#ffffff',
            colorBackground: '#202442',
            colorMuted: '#25294a'
          }
        },
        signUp: {
          variables: {
            colorForeground: '#ffffff',
            colorBackground: '#202442',
            colorMuted: '#25294a'
          }
        }
      }}
    >
      <Providers>
        <html lang="id">
          <body className={`${poppins.variable} antialiased`}>{children}</body>
        </html>
      </Providers>
    </ClerkProvider>
  )
}
