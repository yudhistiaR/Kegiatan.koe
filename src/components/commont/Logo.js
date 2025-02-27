import Link from 'next/link'

const Logo = () => {
  return (
    <Link href="/home">
      <span className="relative font-bold">
        <span className="text-3xl">Kegiatan</span>
        <span className="absolute bottom-4 right-0 text-primary-300">.koe</span>
      </span>
    </Link>
  )
}

export default Logo
