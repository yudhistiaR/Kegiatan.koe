'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Target, CheckCircle, Clock } from 'lucide-react'

export function FundingOverviewCards({ data }) {
  const formatCurrency = value => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  // Calculate target from approved RAB
  const targetAmount = data.rab
    .filter(rab => rab.status === 'APPROVED')
    .reduce((total, rab) => {
      const rabTotal = rab.listRab.reduce((sum, item) => {
        return (
          sum +
          (Number.parseInt(item.harga) || 0) *
            (Number.parseInt(item.jumlah) || 0)
        )
      }, 0)
      return total + rabTotal
    }, 0)

  // Calculate confirmed funding
  const confirmedAmount = data.Pendanaan.filter(
    pendanaan => pendanaan.status === 'APPROVED'
  ).reduce(
    (total, pendanaan) => total + (Number.parseInt(pendanaan.jumlah) || 0),
    0
  )

  // Calculate pending funding
  const pendingAmount = data.Pendanaan.filter(
    pendanaan => pendanaan.status === 'PENDING'
  ).reduce(
    (total, pendanaan) => total + (Number.parseInt(pendanaan.jumlah) || 0),
    0
  )

  // Calculate remaining needed
  const remainingAmount = Math.max(0, targetAmount - confirmedAmount)

  // Calculate progress percentage
  const progressPercentage =
    targetAmount > 0 ? (confirmedAmount / targetAmount) * 100 : 0
  const potentialPercentage =
    targetAmount > 0
      ? ((confirmedAmount + pendingAmount) / targetAmount) * 100
      : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Target Anggaran */}
      <Card className="border border-[#3d4166] bg-[#2d3154]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">
            Target Anggaran (RAB)
          </CardTitle>
          <Target className="h-4 w-4 text-[#4b6fd7]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(targetAmount)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {data.rab.filter(r => r.status === 'APPROVED').length} RAB disetujui
          </p>
        </CardContent>
      </Card>

      {/* Dana Terkonfirmasi */}
      <Card className="border border-[#3d4166] bg-[#2d3154]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">
            Dana Terkonfirmasi
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">
            {formatCurrency(confirmedAmount)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {data.Pendanaan.filter(p => p.status === 'APPROVED').length} sumber
            dana
          </p>
        </CardContent>
      </Card>

      {/* Dana Pending */}
      <Card className="border border-[#3d4166] bg-[#2d3154]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">
            Dana Pending
          </CardTitle>
          <Clock className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-400">
            {formatCurrency(pendingAmount)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {data.Pendanaan.filter(p => p.status === 'PENDING').length} sumber
            menunggu
          </p>
        </CardContent>
      </Card>

      {/* Sisa Dibutuhkan */}
      <Card className="border border-[#3d4166] bg-[#2d3154]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">
            Sisa Dibutuhkan
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${remainingAmount > 0 ? 'text-red-400' : 'text-green-400'}`}
          >
            {remainingAmount > 0
              ? formatCurrency(remainingAmount)
              : 'Tercapai!'}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {progressPercentage.toFixed(1)}% dari target
          </p>
        </CardContent>
      </Card>

      {/* Progress Section */}
      <Card className="border border-[#3d4166] bg-[#2d3154] md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-white">Progress Pendanaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Dana Terkonfirmasi</span>
              <span className="text-white font-medium">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="relative">
              <Progress
                value={Math.min(progressPercentage, 100)}
                className="h-3 bg-[#25294a]"
              />
              {/* Potential overlay */}
              {pendingAmount > 0 && (
                <Progress
                  value={Math.min(potentialPercentage, 100)}
                  className="h-3 bg-[#25294a] absolute top-0 opacity-50"
                />
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-400">
                {formatCurrency(confirmedAmount)}
              </span>
              <span className="text-gray-400">
                {formatCurrency(targetAmount)}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Terkonfirmasi</span>
            </div>
            {pendingAmount > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-50"></div>
                <span className="text-gray-300">Potensi Total</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
