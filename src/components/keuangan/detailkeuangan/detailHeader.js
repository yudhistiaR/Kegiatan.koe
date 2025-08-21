'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Clock, Users, Building } from 'lucide-react'

export function FundingDetailHeader({ data }) {
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const calculateDuration = () => {
    const start = new Date(data.start)
    const end = new Date(data.end)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDaysRemaining = () => {
    const end = new Date(data.end)
    const today = new Date()
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining()
  const duration = calculateDuration()

  return (
    <Card className="border border-[#3d4166] bg-[#2d3154]">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={data.organisasi.image_url || '/placeholder.svg'}
                  alt={data.organisasi.name}
                />
                <AvatarFallback className="bg-[#4b6fd7] text-white">
                  {data.organisasi.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {data.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-400">
                  <Building className="w-4 h-4" />
                  <span>{data.organisasi.name}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              {data.description}
            </p>

            {/* Timeline Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 bg-[#25294a] rounded-lg p-3">
                <Calendar className="w-5 h-5 text-[#4b6fd7]" />
                <div>
                  <div className="text-sm text-gray-400">Tanggal Mulai</div>
                  <div className="text-white font-medium">
                    {formatDate(data.start)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#25294a] rounded-lg p-3">
                <Calendar className="w-5 h-5 text-[#4b6fd7]" />
                <div>
                  <div className="text-sm text-gray-400">Tanggal Selesai</div>
                  <div className="text-white font-medium">
                    {formatDate(data.end)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#25294a] rounded-lg p-3">
                <Clock className="w-5 h-5 text-[#4b6fd7]" />
                <div>
                  <div className="text-sm text-gray-400">Durasi</div>
                  <div className="text-white font-medium">{duration} hari</div>
                </div>
              </div>
            </div>

            {/* Status & Countdown */}
            <div className="flex items-center gap-4">
              {daysRemaining > 0 ? (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {daysRemaining} hari tersisa
                </Badge>
              ) : daysRemaining === 0 ? (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Hari ini
                </Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  Selesai
                </Badge>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:w-80 space-y-6">
            {/* Ketua Pelaksana */}
            <div className="bg-[#25294a] rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Ketua Pelaksana</h3>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={data.ketua_pelaksana.profileImg || '/placeholder.svg'}
                    alt={data.ketua_pelaksana.fullName}
                  />
                  <AvatarFallback className="bg-[#4b6fd7] text-white">
                    {data.ketua_pelaksana.fullName
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-white font-medium">
                    {data.ketua_pelaksana.fullName}
                  </div>
                  <div className="text-sm text-gray-400">
                    {data.ketua_pelaksana.npm}
                  </div>
                  <div className="text-sm text-gray-400">
                    {data.ketua_pelaksana.universitas}
                  </div>
                </div>
              </div>
            </div>

            {/* Divisi */}
            <div className="bg-[#25294a] rounded-lg p-4">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Divisi Terlibat
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.divisi.map((divisi, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-[#4b6fd7] text-[#4b6fd7]"
                  >
                    {divisi.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
