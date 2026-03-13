'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function Page() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
      callbackURL: '/'
    })

    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="container mx-auto flex justify-center items-center max-h-screen h-screen">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-lg border border-slate-700 bg-[#202442] p-6 text-white"
      >
        <h1 className="mb-6 text-2xl font-semibold">Masuk</h1>
        <div className="mb-4">
          <label className="mb-2 block text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded border border-slate-600 bg-[#25294a] px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded border border-slate-600 bg-[#25294a] px-3 py-2"
            required
          />
        </div>
        {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-indigo-500 px-4 py-2 font-medium disabled:opacity-60"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}
