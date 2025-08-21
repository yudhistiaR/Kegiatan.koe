'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Plus, X, Check, Clock } from 'lucide-react'

export function FundingSourceForm({ sources, onSourcesChange }) {
  const [newSource, setNewSource] = useState({
    name: '',
    type: 'sponsor',
    amount: 0,
    confirmed: false,
    contact: '',
    notes: '',
    probability: 50
  })

  const formatCurrency = value => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  const getTypeColor = type => {
    switch (type) {
      case 'sponsor':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'grant':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'donation':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'internal':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeText = type => {
    switch (type) {
      case 'sponsor':
        return 'Sponsor'
      case 'grant':
        return 'Grant'
      case 'donation':
        return 'Donasi'
      case 'internal':
        return 'Internal'
      case 'other':
        return 'Lainnya'
      default:
        return type
    }
  }

  const addSource = () => {
    if (newSource.name && newSource.amount && newSource.amount > 0) {
      const source = {
        id: Date.now().toString(),
        name: newSource.name,
        type: newSource.type,
        amount: newSource.amount,
        confirmed: newSource.confirmed || false,
        contact: newSource.contact || '',
        notes: newSource.notes || '',
        probability: newSource.probability || 50
      }
      onSourcesChange([...sources, source])
      setNewSource({
        name: '',
        type: 'sponsor',
        amount: 0,
        confirmed: false,
        contact: '',
        notes: '',
        probability: 50
      })
    }
  }

  const removeSource = id => {
    onSourcesChange(sources.filter(s => s.id !== id))
  }

  const toggleConfirmed = id => {
    onSourcesChange(
      sources.map(s => (s.id === id ? { ...s, confirmed: !s.confirmed } : s))
    )
  }

  const totalAmount = sources.reduce((sum, source) => sum + source.amount, 0)
  const confirmedAmount = sources
    .filter(s => s.confirmed)
    .reduce((sum, source) => sum + source.amount, 0)
  const expectedAmount = sources.reduce(
    (sum, source) => sum + (source.amount * source.probability) / 100,
    0
  )

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="border border-[#3d4166] bg-[#2d3154]">
        <CardHeader>
          <CardTitle className="text-white">Ringkasan Sumber Dana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(totalAmount)}
              </div>
              <div className="text-sm text-gray-400">Total Potensi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {formatCurrency(confirmedAmount)}
              </div>
              <div className="text-sm text-gray-400">Terkonfirmasi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {formatCurrency(expectedAmount)}
              </div>
              <div className="text-sm text-gray-400">Ekspektasi</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Source */}
      <Card className="border border-[#3d4166] bg-[#2d3154]">
        <CardHeader>
          <CardTitle className="text-white">Tambah Sumber Dana</CardTitle>
          <CardDescription>
            Tambahkan sumber pendanaan untuk kegiatan ini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Nama Sumber Dana
              </label>
              <Input
                placeholder="Contoh: PT. ABC Sponsor"
                value={newSource.name}
                onChange={e =>
                  setNewSource({ ...newSource, name: e.target.value })
                }
                className="bg-[#25294a] border-[#3d4166] text-white focus:ring-[#4b6fd7] focus:border-[#4b6fd7]"
              />
            </div>
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium text-white">Tipe</label>
              <Select
                className="w-full"
                value={newSource.type}
                onValueChange={value =>
                  setNewSource({ ...newSource, type: value })
                }
              >
                <SelectTrigger className="bg-[#25294a] border-[#3d4166] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2d3154] border-[#3d4166]">
                  <SelectItem
                    value="sponsor"
                    className="text-white hover:bg-[#4b6fd7]/20"
                  >
                    Sponsor
                  </SelectItem>
                  <SelectItem
                    value="grant"
                    className="text-white hover:bg-[#4b6fd7]/20"
                  >
                    Grant
                  </SelectItem>
                  <SelectItem
                    value="donation"
                    className="text-white hover:bg-[#4b6fd7]/20"
                  >
                    Donasi
                  </SelectItem>
                  <SelectItem
                    value="internal"
                    className="text-white hover:bg-[#4b6fd7]/20"
                  >
                    Internal
                  </SelectItem>
                  <SelectItem
                    value="other"
                    className="text-white hover:bg-[#4b6fd7]/20"
                  >
                    Lainnya
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Jumlah Dana
              </label>
              <Input
                type="number"
                placeholder="0"
                value={newSource.amount || ''}
                onChange={e =>
                  setNewSource({
                    ...newSource,
                    amount: Number.parseInt(e.target.value) || 0
                  })
                }
                className="bg-[#25294a] border-[#3d4166] text-white focus:ring-[#4b6fd7] focus:border-[#4b6fd7]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Probabilitas (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="50"
                value={newSource.probability || ''}
                onChange={e =>
                  setNewSource({
                    ...newSource,
                    probability: Number.parseInt(e.target.value) || 50
                  })
                }
                className="bg-[#25294a] border-[#3d4166] text-white focus:ring-[#4b6fd7] focus:border-[#4b6fd7]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Kontak</label>
            <Input
              placeholder="Email atau nomor telepon"
              value={newSource.contact}
              onChange={e =>
                setNewSource({ ...newSource, contact: e.target.value })
              }
              className="bg-[#25294a] border-[#3d4166] text-white focus:ring-[#4b6fd7] focus:border-[#4b6fd7]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Catatan</label>
            <Textarea
              placeholder="Catatan tambahan tentang sumber dana ini"
              value={newSource.notes}
              onChange={e =>
                setNewSource({ ...newSource, notes: e.target.value })
              }
              className="bg-[#25294a] border-[#3d4166] text-white focus:ring-[#4b6fd7] focus:border-[#4b6fd7]"
              rows={3}
            />
          </div>

          <Button
            onClick={addSource}
            className="bg-[#4b6fd7] hover:bg-[#3d5bc7] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Sumber Dana
          </Button>
        </CardContent>
      </Card>

      {/* Sources List */}
      {sources.length > 0 && (
        <Card className="border border-[#3d4166] bg-[#2d3154]">
          <CardHeader>
            <CardTitle className="text-white">
              Daftar Sumber Dana ({sources.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sources.map(source => (
                <div
                  key={source.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-[#3d4166] hover:border-[#4b6fd7]/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-white">{source.name}</h4>
                      <Badge className={getTypeColor(source.type)}>
                        {getTypeText(source.type)}
                      </Badge>
                      {source.confirmed ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Check className="w-3 h-3 mr-1" />
                          Terkonfirmasi
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div>
                        Jumlah:{' '}
                        <span className="text-white font-medium">
                          {formatCurrency(source.amount)}
                        </span>
                      </div>
                      <div>
                        Probabilitas:{' '}
                        <span className="text-white">
                          {source.probability}%
                        </span>
                      </div>
                      {source.contact && (
                        <div>
                          Kontak:{' '}
                          <span className="text-white">{source.contact}</span>
                        </div>
                      )}
                      {source.notes && (
                        <div>
                          Catatan:{' '}
                          <span className="text-white">{source.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant={source.confirmed ? 'default' : 'outline'}
                      className={
                        source.confirmed
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'border-[#4b6fd7] text-white hover:bg-[#4b6fd7] bg-transparent'
                      }
                      onClick={() => toggleConfirmed(source.id)}
                    >
                      {source.confirmed ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-red-400 hover:bg-red-500/20"
                      onClick={() => removeSource(source.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
