'use client'

import { buttonVariants } from '../ui/button'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Plus, Target, TrendingUp, DollarSign, Search } from 'lucide-react'
import { FinanceCard } from './ui/FinansialCard'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

const PendanaanKegiatanPage = () => {
  const { orgSlug } = useAuth()

  return (
    <div className="w-full h-full space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Atur Pendanaan Kegiatan</h1>
          <p className="text-md text-gray-300">
            Kelola dan pantau pendanaan untuk semua kegiatan organisasi
          </p>
        </div>
        <Link
          className={buttonVariants()}
          href={`/${orgSlug}/keuangan/pendanaan`}
        >
          <Plus /> Tambah Program Kerja
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FinanceCard
          title="Total Target Dana"
          amount={{ value: 10000, isCounter: false }}
          description="Akumulasi semua target pendanaan"
          icon={Target}
          trend={{ value: 20, isPositive: true }}
        />
        <FinanceCard
          title="Dana Terkumpul"
          amount={{ value: 248938, isCounter: false }}
          description="Dana yang sudah terkonfirmasi"
          icon={DollarSign}
        />
        <FinanceCard
          title="Program Kerja Aktif"
          amount={{ value: 10, isCounter: true }}
          description="Jumlah proyek yang sedang berjalan"
          icon={TrendingUp}
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari proyek pendanaan..."
            className="pl-10 bg-[#2d3154] border-[#3d4166] text-white focus:ring-[#4b6fd7] focus:border-[#4b6fd7]"
          />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-[180px] bg-[#2d3154] border-[#3d4166] text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#2d3154] border-[#3d4166]">
            <SelectItem value="all" className="text-white hover:bg-[#4b6fd7]">
              Semua Status
            </SelectItem>
            <SelectItem value="draft" className="text-white hover:bg-[#4b6fd7]">
              Draft
            </SelectItem>
            <SelectItem
              value="active"
              className="text-white hover:bg-[#4b6fd7]"
            >
              Aktif
            </SelectItem>
            <SelectItem
              value="completed"
              className="text-white hover:bg-[#4b6fd7]"
            >
              Selesai
            </SelectItem>
            <SelectItem
              value="cancelled"
              className="text-white hover:bg-[#4b6fd7]"
            >
              Dibatalkan
            </SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-[180px] bg-[#2d3154] border-[#3d4166] text-white">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent className="bg-[#2d3154] border-[#3d4166]">
            <SelectItem value="all" className="text-white hover:bg-[#4b6fd7]">
              Semua Kategori
            </SelectItem>
            <SelectItem className="text-white hover:bg-[#4b6fd7]">
              Ilan
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default PendanaanKegiatanPage
