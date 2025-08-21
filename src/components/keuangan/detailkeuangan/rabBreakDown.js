'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export function RABBreakdownTable({ data }) {
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

  const getDivisionName = divisiId => {
    const divisi = data.divisi.find(d => d.id === divisiId)
    return divisi?.name || 'Unknown'
  }

  // Calculate total approved budget
  const totalApprovedBudget = data.rab
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

  return (
    <Card className="border border-[#3d4166] bg-[#2d3154]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">
            Rincian Anggaran Biaya (RAB)
          </CardTitle>
          <div className="text-right">
            <div className="text-sm text-gray-400">
              Total Anggaran Disetujui
            </div>
            <div className="text-xl font-bold text-green-400">
              {formatCurrency(totalApprovedBudget)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.rab.map(rab => {
          const divisionName = getDivisionName(rab.divisiId)
          const rabTotal = rab.listRab.reduce((sum, item) => {
            return (
              sum +
              (Number.parseInt(item.harga) || 0) *
                (Number.parseInt(item.jumlah) || 0)
            )
          }, 0)

          return (
            <div key={rab.id} className="bg-[#25294a] rounded-lg p-4">
              {/* Division Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-white">
                    Divisi {divisionName}
                  </h3>
                  <Badge className={getStatusColor(rab.status)}>
                    {getStatusText(rab.status)}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Total Divisi</div>
                  <div className="text-lg font-bold text-white">
                    {formatCurrency(rabTotal)}
                  </div>
                </div>
              </div>

              {/* RAB Items Table */}
              <div className="bg-[#1a1d3a] rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#3d4166] hover:bg-[#2d3154]">
                      <TableHead className="text-gray-300">Item</TableHead>
                      <TableHead className="text-gray-300 text-center">
                        Qty
                      </TableHead>
                      <TableHead className="text-gray-300 text-center">
                        Satuan
                      </TableHead>
                      <TableHead className="text-gray-300 text-right">
                        Harga Satuan
                      </TableHead>
                      <TableHead className="text-gray-300 text-right">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rab.listRab.map(item => {
                      const itemTotal =
                        (Number.parseInt(item.harga) || 0) *
                        (Number.parseInt(item.jumlah) || 0)
                      return (
                        <TableRow
                          key={item.id}
                          className="border-[#3d4166] hover:bg-[#25294a]"
                        >
                          <TableCell className="text-white font-medium">
                            {item.nama}
                          </TableCell>
                          <TableCell className="text-white text-center">
                            {item.jumlah}
                          </TableCell>
                          <TableCell className="text-gray-300 text-center">
                            {item.satuan}
                          </TableCell>
                          <TableCell className="text-white text-right">
                            {formatCurrency(Number.parseInt(item.harga) || 0)}
                          </TableCell>
                          <TableCell className="text-white text-right font-medium">
                            {formatCurrency(itemTotal)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Notes */}
              {rab.note && (
                <div className="mt-4 p-3 bg-[#1a1d3a] rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Catatan:</div>
                  <p className="text-sm text-gray-300">{rab.note}</p>
                </div>
              )}
            </div>
          )
        })}

        {/* Empty State */}
        {data.rab.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">Belum ada RAB yang dibuat</div>
            <p className="text-sm text-gray-500">
              RAB akan muncul setelah divisi mengajukan anggaran
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
