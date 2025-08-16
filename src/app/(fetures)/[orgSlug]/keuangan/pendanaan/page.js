'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, X, MoveLeft } from 'lucide-react'
import { SingleSelect } from '@/components/ui/CustomeSelect'
import { FundingSourceForm } from '@/components/keuangan/ui/FundingSourceForm'

export default function PendanaanPage({ initialData, onSave }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'event',
    targetAmount: initialData?.targetAmount || 0,
    deadline: initialData?.deadline,
    sources: initialData?.sources || []
  })

  const router = useRouter()

  const handleSubmit = e => {
    e.preventDefault()
    if (formData.title && formData.targetAmount > 0 && formData.deadline) {
      onSave(formData)
    }
  }

  const formatCurrency = value => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  const currentAmount = formData.sources.reduce(
    (sum, source) => sum + source.amount,
    0
  )
  const confirmedAmount = formData.sources
    .filter(s => s.confirmed)
    .reduce((sum, source) => sum + source.amount, 0)

  const options = data => {
    return data.map(item => ({ value: item.id, label: item.title }))
  }

  const { data, isLoading, isPending } = useQuery({
    queryKey: ['proker'],
    queryFn: async () => {
      const req = await fetch('/api/v1/proker')
      if (!req.ok) {
        throw new Error('Failed to fetch tasks')
      }
      return req.json()
    },
    select: data => options(data)
  })

  return (
    <div>
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <MoveLeft /> Kembali
        </Button>
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Tambah Pendanaan Program Kerja</h1>
          <p>Buat Proyek pendanaan baru untuk kegiatan organisasi</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border border-[#3d4166] bg-[#2d3154]">
          <CardHeader>
            <CardTitle className="text-white">Informasi Dasar</CardTitle>
            <CardDescription>
              Informasi umum tentang pendanaan kegiatan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Nama Kegiatan *
              </label>
              <SingleSelect
                isLoading={isLoading || isPending}
                className="bg-[#25294a] border-[#3d4166] text-white focus:ring-[#4b6fd7] focus:border-[#4b6fd7] mt-2"
                placeholder="Pilih Program Kerja"
                required
                options={data}
              />
            </div>
          </CardContent>
        </Card>

        {/* Funding Summary */}
        {formData.targetAmount > 0 && (
          <Card className="border border-[#3d4166] bg-[#2d3154]">
            <CardHeader>
              <CardTitle className="text-white">Ringkasan Pendanaan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(formData.targetAmount)}
                  </div>
                  <div className="text-sm text-gray-400">Target</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {formatCurrency(currentAmount)}
                  </div>
                  <div className="text-sm text-gray-400">Total Potensi</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {formatCurrency(confirmedAmount)}
                  </div>
                  <div className="text-sm text-gray-400">Terkonfirmasi</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {formatCurrency(
                      Math.max(0, formData.targetAmount - confirmedAmount)
                    )}
                  </div>
                  <div className="text-sm text-gray-400">Sisa Dibutuhkan</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Funding Sources */}
        <FundingSourceForm
          sources={formData.sources}
          onSourcesChange={sources => setFormData({ ...formData, sources })}
        />

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-[#3d4166] text-white hover:bg-[#3d4166] bg-transparent"
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
          <Button
            type="submit"
            className="bg-[#4b6fd7] hover:bg-[#3d5bc7] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
        </div>
      </form>
    </div>
  )
}
