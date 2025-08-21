'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Calendar, Edit, Eye, Building } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { formatCurrency } from '@/lib/utils'
import { formatDate } from '@/helpers/formatedate'

export function FundingCard({ data, onEdit }) {
  const { orgSlug } = useAuth()

  const getStatusFromRAB = rabList => {
    if (!rabList || rabList.length === 0) return 'draft'
    const hasApproved = rabList.some(rab => rab.status === 'APPROVED')
    const hasPending = rabList.some(rab => rab.status === 'PENDING')
    const hasRejected = rabList.some(rab => rab.status === 'REJECTED')

    if (hasApproved) return 'active'
    if (hasPending) return 'planning'
    if (hasRejected) return 'cancelled'
    return 'draft'
  }

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'planning':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'draft':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusText = status => {
    switch (status) {
      case 'active':
        return 'Aktif'
      case 'planning':
        return 'Perencanaan'
      case 'cancelled':
        return 'Dibatalkan'
      case 'draft':
        return 'Draft'
      default:
        return status
    }
  }

  const getDaysRemaining = endDate => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const calculateTargetFromRAB = () => {
    const approvedRABs = data.rab.filter(rab => rab.status === 'APPROVED')
    let totalFromRAB = 0

    approvedRABs.forEach(rab => {
      if (rab.listRab && rab.listRab.length > 0) {
        const rabTotal = rab.listRab.reduce((sum, item) => {
          const itemTotal =
            (Number.parseInt(item.harga) || 0) *
            (Number.parseInt(item.jumlah) || 0)
          return sum + itemTotal
        }, 0)
        totalFromRAB += rabTotal
      }
    })

    const rabBreakdown = approvedRABs.map(rab => {
      const divisi = data.divisi.find(d => d.id === rab.divisiId)
      const itemsTotal =
        rab.listRab?.reduce((sum, item) => {
          const itemTotal =
            (Number.parseInt(item.harga) || 0) *
            (Number.parseInt(item.jumlah) || 0)
          return sum + itemTotal
        }, 0) || 0
      return {
        divisiName: divisi?.name || 'Unknown',
        total: itemsTotal,
        itemCount: rab.listRab?.length || 0
      }
    })

    return {
      total: totalFromRAB,
      approvedRABCount: approvedRABs.length,
      totalRABCount: data.rab.length,
      rabBreakdown: rabBreakdown
    }
  }

  const calculateFundingFromPendanaan = () => {
    const pendanaan = data.Pendanaan || []

    const confirmedFunding = pendanaan
      .filter(p => p.status === 'APPROVED' || p.status === 'CONFIRMED')
      .reduce((total, p) => total + (Number.parseInt(p.jumlah) || 0), 0)

    const pendingFunding = pendanaan
      .filter(p => p.status === 'PENDING')
      .reduce((total, p) => total + (Number.parseInt(p.jumlah) || 0), 0)

    const totalPotentialFunding = confirmedFunding + pendingFunding

    return {
      confirmed: confirmedFunding,
      pending: pendingFunding,
      total: totalPotentialFunding,
      count: pendanaan.length,
      confirmedCount: pendanaan.filter(
        p => p.status === 'APPROVED' || p.status === 'CONFIRMED'
      ).length,
      pendingCount: pendanaan.filter(p => p.status === 'PENDING').length,
      rejectedCount: pendanaan.filter(p => p.status === 'REJECTED').length
    }
  }

  const rabData = calculateTargetFromRAB()
  const targetAmount = rabData.total
  const fundingData = calculateFundingFromPendanaan()
  const currentAmount = fundingData.confirmed
  const potentialAmount = fundingData.total

  const progressPercentage =
    targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0
  const potentialProgressPercentage =
    targetAmount > 0 ? (potentialAmount / targetAmount) * 100 : 0
  const remainingAmount = targetAmount - currentAmount
  const status = getStatusFromRAB(data.rab)
  const daysRemaining = getDaysRemaining(data.end)

  return (
    <Card className="border border-[#3d4166] bg-[#2d3154] hover:border-[#4b6fd7]/50 transition-colors text-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(status)}>
                {getStatusText(status)}
              </Badge>
              {daysRemaining < 0 && (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  Selesai
                </Badge>
              )}
              {daysRemaining >= 0 && daysRemaining <= 7 && (
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  Segera Berakhir
                </Badge>
              )}
              <Badge
                variant="outline"
                className="border-[#4b6fd7] text-[#4b6fd7]"
              >
                {data.divisi.length} Divisi
              </Badge>
            </div>
            <CardTitle className="text-white mb-2">{data.title}</CardTitle>
            <CardDescription className="text-gray-300">
              {data.description}
            </CardDescription>
          </div>
          <div className="flex gap-1 ml-4">
            <Link
              href={`/${orgSlug}/keuangan/pendanaan/${data.id}/detail`}
              className={`${buttonVariants({ variant: 'ghost', size: 'sm' }, 'text-gray-400 hover:text-accentColor hover:bg-[#4b6fd7]/20')}`}
            >
              <Eye className="w-4 h-4" />
            </Link>
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-[#4b6fd7]/20"
              onClick={() => onEdit?.(data.id)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ketua Pelaksana */}
        <div className="flex items-center gap-3">
          <Image
            src={data.ketua_pelaksana.profileImg || '/placeholder.svg'}
            alt={data.ketua_pelaksana.fullName}
            className="rounded-full"
            width={32}
            height={32}
          />
          <div className="flex-1">
            <div className="text-sm text-white font-medium">
              {data.ketua_pelaksana.fullName}
            </div>
            <div className="text-xs text-gray-400">Ketua Pelaksana</div>
          </div>
        </div>

        {/* Progress Section */}
        {targetAmount > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progress Pendanaan</span>
              <span className="text-white font-medium">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="relative h-3">
              <Progress
                value={Math.min(potentialProgressPercentage, 100)}
                className="h-3 absolute w-full bg-accentColor"
                indicatorClassName="bg-accentColor"
              />
              <Progress
                value={Math.min(progressPercentage, 100)}
                className="h-3 absolute w-full bg-foreground"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-green-400 font-medium">
                  Terkonfirmasi: {formatCurrency(currentAmount)}
                </span>
                <span className="text-gray-400">
                  Target: {formatCurrency(targetAmount)}
                </span>
              </div>
              {potentialAmount > currentAmount && (
                <div className="flex justify-between text-xs">
                  <span className="text-yellow-400">
                    Potensi Total: {formatCurrency(potentialAmount)}
                  </span>
                  <span className="text-yellow-400">
                    ({potentialProgressPercentage.toFixed(1)}%)
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Financial Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Target Anggaran (RAB)</div>
            <div className="text-white font-medium">
              {targetAmount > 0
                ? formatCurrency(targetAmount)
                : 'Belum ada RAB disetujui'}
            </div>
            {rabData.approvedRABCount > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {rabData.approvedRABCount} dari {rabData.totalRABCount} RAB
                disetujui
              </div>
            )}
          </div>
          <div>
            <div className="text-gray-400">Sisa Dibutuhkan</div>
            <div
              className={`font-medium ${remainingAmount > 0 ? 'text-red-400' : 'text-green-400'}`}
            >
              {targetAmount > 0
                ? remainingAmount > 0
                  ? formatCurrency(remainingAmount)
                  : 'Tercapai!'
                : 'Menunggu RAB'}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDate(data.start)} - {formatDate(data.end)}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {daysRemaining > 0
              ? `${daysRemaining} hari tersisa`
              : daysRemaining === 0
                ? 'Berakhir hari ini'
                : `Selesai ${Math.abs(daysRemaining)} hari yang lalu`}
          </div>
        </div>

        {/* Organization */}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Building className="w-4 h-4" />
          <span>{data.organisasi.name}</span>
        </div>
      </CardContent>
    </Card>
  )
}
