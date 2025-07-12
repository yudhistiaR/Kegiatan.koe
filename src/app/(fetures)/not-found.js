'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="font-bold text-accentColor">404!</h1>
      <h2 className="font-bold text-4xl">Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/dashboard">Return Home</Link>
    </div>
  )
}
