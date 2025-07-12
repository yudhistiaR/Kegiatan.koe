'use client'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

export default function Home() {
  const { orgSlug } = useAuth()

  return (
    <div className="container">
      <Link
        href={`/${orgSlug ?? 'tamu'}/dashboard`}
        className="text-8xl font-bold hover:text-accentColor"
      >
        Dashboard
      </Link>
    </div>
  )
}
