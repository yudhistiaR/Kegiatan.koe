'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { FileText, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export function BudgetDetail({ isOpen, onClose, selectedRab }) {
  if (!selectedRab) return null
  const totalBudget = selectedRab.listRab.reduce(
    (sum, item) => sum + item.harga * item.jumlah,
    0
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-auto border-accentColor text-white">
        <DialogHeader>
          <DialogTitle>Detail RAB - {selectedRab.proker?.title}</DialogTitle>
          <DialogDescription>
            Informasi lengkap rencana anggaran biaya
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <Card className="border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> Informasi Program
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-gray-400 block">Nama Program:</strong>{' '}
                {selectedRab.proker?.title}
              </div>
              <div>
                <strong className="text-gray-400 block">
                  Ketua Pelaksana:
                </strong>{' '}
                {selectedRab.proker?.ketua_pelaksana?.fullName}
              </div>
              <div>
                <strong className="text-gray-400 block">Divisi:</strong>{' '}
                {selectedRab.divisi?.name}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" /> Ringkasan Anggaran
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around">
              <div className="text-center">
                <p className="text-gray-400">Total Item</p>
                <p className="text-2xl font-bold">
                  {selectedRab.listRab.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400">Total Anggaran</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalBudget)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700">
            <CardHeader>
              <CardTitle>Rincian Item Anggaran</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Item</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedRab.listRab.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>{formatCurrency(item.harga)}</TableCell>
                      <TableCell>
                        {item.jumlah} {item.satuan}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(item.harga * item.jumlah)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
