import Link from 'next/link'
import Image from 'next/image'

export const MainLogo = () => {
  return (
    <Link className="block relative h-10 w-60" href="/dashboard">
      <Image
        src="/main_logo.png"
        fill
        alt="main logo"
        className="overflow-hidden object-contain"
      />
    </Link>
  )
}

export const Logo = () => {
  return (
    <Link className="block relative h-10 w-15" href="/dashboard">
      <Image
        src="/logo.svg"
        fill
        alt="main logo"
        className="overflow-hidden object-contain"
      />
    </Link>
  )
}
