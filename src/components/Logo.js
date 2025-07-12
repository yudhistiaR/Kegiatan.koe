import Link from 'next/link'
import Image from 'next/image'

export const MainLogo = () => {
  return (
    <Link className="block relative h-full w-40" href="/dashboard">
      <Image
        src="/main_logo.png"
        fill
        alt="main logo"
        className="overflow-hidden object-fill"
      />
    </Link>
  )
}

export const Logo = () => {
  return (
    <Link className="block relative h-full w-40" href="/dashboard">
      <Image
        src="/logo.svg"
        fill
        alt="main logo"
        className="overflow-hidden object-fill"
      />
    </Link>
  )
}
