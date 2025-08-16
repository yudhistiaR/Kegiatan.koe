'use client'

import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'

import { useAuth } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import { formatCurrency } from '@/lib/utils'
import { Button } from '../ui/button'

const DetailKeuangan = () => {
  const { orgId } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['keuangan', orgId],
    queryFn: async () => {
      const req = await fetch(`/api/v1/organisasi/${orgId}/keuangan`)

      if (!req.ok) throw new Error('Gagal mendapatkan data')

      return req.json()
    }
  })

  console.log(data)

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center h-[100px] bg-accentColor p-4 rounded-md text-3xl font-bold mb-4">
        <h1>Sisa Dana Organisasi</h1>
        <div className="flex justify-center items-center gap-2">
          {isLoading ? (
            <p>Loading....</p>
          ) : (
            <p className="flex items-center justify-center gap-2">
              {formatCurrency(data?.jumlah ?? 0)} <Wallet />
            </p>
          )}
        </div>
      </div>
      <div className="my-4 flex gap-4">
        <Button className="flex-1">
          <TrendingUp /> Tambah Pemasukan
        </Button>
        <Button className="flex-1" variant="destructive">
          <TrendingDown /> Tambah Pengeluaran
        </Button>
      </div>
      <div className="w-full h-full border p-4 rounded-md">
        <h1 className="text-2xl font-bold mb-4">History Pendanaan</h1>
        <div className="flex justify-between items-center">
          <div className="flex-1 bg-red-200">
            <h2>Dana Masuk</h2>
          </div>
          <div className="flex-1 bg-red-400">
            <h2>Dana Keluar</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailKeuangan
