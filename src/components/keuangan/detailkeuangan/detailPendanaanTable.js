'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Phone, Edit, Trash2 } from 'lucide-react'
import { AddFundingSourceDialog } from './createSumerDana'
import { DeleteFundingSourceAlert } from './hapusSumberDana'
import { EditFundingSourceDialog } from './editFuding'

export function FundingSourcesTable({ data }) {
  const [fundingSources] = useState(data.Pendanaan)

  const formatCurrency = value => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  const getStatusColor = status => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'REJECTED':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusText = status => {
    switch (status) {
      case 'APPROVED':
        return 'Disetujui'
      case 'PENDING':
        return 'Menunggu'
      case 'REJECTED':
        return 'Ditolak'
      default:
        return status
    }
  }

  const getTypeColor = type => {
    switch (type) {
      case 'Sponsor':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Hibah':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'Donasi':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Internal':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  // Calculate totals
  const approvedTotal = fundingSources
    .filter(p => p.status === 'APPROVED')
    .reduce((sum, p) => sum + (Number.parseInt(p.jumlah) || 0), 0)

  const pendingTotal = fundingSources
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + (Number.parseInt(p.jumlah) || 0), 0)

  const rejectedTotal = fundingSources
    .filter(p => p.status === 'REJECTED')
    .reduce((sum, p) => sum + (Number.parseInt(p.jumlah) || 0), 0)

  return (
    <Card className="border border-[#3d4166] bg-[#2d3154]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Sumber Pendanaan</CardTitle>
          <AddFundingSourceDialog prokerId={data.id} orgId={data.orgId} />
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#25294a] rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Disetujui</div>
            <div className="text-xl font-bold text-green-400">
              {formatCurrency(approvedTotal)}
            </div>
            <div className="text-xs text-gray-500">
              {fundingSources.filter(p => p.status === 'APPROVED').length}{' '}
              sumber
            </div>
          </div>
          <div className="bg-[#25294a] rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Menunggu</div>
            <div className="text-xl font-bold text-yellow-400">
              {formatCurrency(pendingTotal)}
            </div>
            <div className="text-xs text-gray-500">
              {fundingSources.filter(p => p.status === 'PENDING').length} sumber
            </div>
          </div>
          <div className="bg-[#25294a] rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Ditolak</div>
            <div className="text-xl font-bold text-red-400">
              {formatCurrency(rejectedTotal)}
            </div>
            <div className="text-xs text-gray-500">
              {fundingSources.filter(p => p.status === 'REJECTED').length}{' '}
              sumber
            </div>
          </div>
        </div>

        {/* Funding Sources Table */}
        <div className="bg-[#25294a] rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-[#3d4166] hover:bg-[#2d3154]">
                <TableHead className="text-gray-300">Sumber</TableHead>
                <TableHead className="text-gray-300">Tipe</TableHead>
                <TableHead className="text-gray-300 text-right">
                  Jumlah
                </TableHead>
                <TableHead className="text-gray-300 text-center">
                  Status
                </TableHead>
                <TableHead className="text-gray-300">Kontak</TableHead>
                <TableHead className="text-gray-300 text-center">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fundingSources.map(funding => (
                <TableRow
                  key={funding.id}
                  className="border-[#3d4166] hover:bg-[#2d3154]"
                >
                  <TableCell className="text-white font-medium">
                    {funding.sumber}
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(funding.type)}>
                      {funding.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white text-right font-medium">
                    {formatCurrency(Number.parseInt(funding.jumlah) || 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getStatusColor(funding.status)}>
                      {getStatusText(funding.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {funding.kontak ? (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {funding.kontak}
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <EditFundingSourceDialog
                        fundingSource={funding}
                        trigger={
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:bg-[#4b6fd7]/20"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        }
                      />
                      <DeleteFundingSourceAlert
                        fundingSource={funding}
                        trigger={
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty State */}
        {fundingSources.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">Belum ada sumber pendanaan</div>
            <AddFundingSourceDialog
              prokerId={data.id}
              orgId={data.orgId}
              trigger={
                <Button className="bg-[#4b6fd7] hover:bg-[#3d5bc7] text-white">
                  Tambah Sumber Dana Pertama
                </Button>
              }
            />
          </div>
        )}

        {/* Notes Section */}
        {fundingSources.some(p => p.catatan) && (
          <div className="mt-6">
            <h4 className="text-white font-medium mb-3">Catatan</h4>
            <div className="space-y-2">
              {fundingSources
                .filter(p => p.catatan)
                .map(funding => (
                  <div key={funding.id} className="bg-[#25294a] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">
                        {funding.sumber}:
                      </span>
                      <Badge
                        className={getStatusColor(funding.status)}
                        size="sm"
                      >
                        {getStatusText(funding.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300">{funding.catatan}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
