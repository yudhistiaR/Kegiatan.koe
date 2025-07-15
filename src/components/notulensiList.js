'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  Users,
  FileText,
  User,
  AlertCircle
} from 'lucide-react'
import DOMPurify from 'dompurify'
import {
  LoadingState,
  NotDataState,
  ErrorState
} from '@/components/LoadState/LoadStatus'

const NotulensiList = () => {
  const { orgId } = useAuth()
  const { prokerId } = useParams()
  const [openDivisi, setOpenDivisi] = useState({})

  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ['notulensi', orgId, prokerId],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/proker/${orgId}/${prokerId}/notulensi`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    },
    enabled: !!(orgId && prokerId),
    retry: 2
  })

  // Load state
  if (isLoading | isPending) {
    return <LoadingState />
  }
  if (error) {
    return <ErrorState />
  }
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <NotDataState />
  }

  // Group data by division
  const groupedByDivisi = data?.reduce((acc, item) => {
    const divisiName = item.divisi?.name || 'Divisi Tidak Diketahui'
    if (!acc[divisiName]) {
      acc[divisiName] = {
        divisiInfo: item.divisi,
        notulensi: []
      }
    }
    acc[divisiName].notulensi.push(item)
    return acc
  }, {})

  const toggleDivisi = divisiName => {
    setOpenDivisi(prev => ({
      ...prev,
      [divisiName]: !prev[divisiName]
    }))
  }

  const formatDate = dateString => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch (error) {
      return 'Tanggal tidak valid'
    }
  }
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="rounded-xl shadow-lg p-6 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Notulensi Per Divisi</h1>
            <p>
              {data[0]?.organisasi?.name} - Program Kerja{' '}
              {data[0]?.proker?.title}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <User className="w-5 h-5" />
              <span className="text-sm">
                Ketua Pelaksana2: {data[0]?.proker?.author || 'Tidak diketahui'}
              </span>
            </div>
            {data[0]?.proker?.description && (
              <p className="text-sm mt-2">{data[0]?.proker?.description}</p>
            )}
          </div>
        </div>

        {/* Divisi List */}
        <div className="space-y-6">
          {Object.entries(groupedByDivisi).map(([divisiName, divisiData]) => (
            <div
              key={divisiName}
              className="rounded-xl shadow-lg overflow-hidden"
            >
              {/* Divisi Header */}
              <div
                className="p-6 cursor-pointer transition-colors hover:bg-accentColor"
                onClick={() => toggleDivisi(divisiName)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">{divisiName}</h2>
                      <p className="text-sm  mt-1">
                        {divisiData.divisiInfo?.description ||
                          'Tidak ada deskripsi'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-accentColor px-3 py-1 rounded-full text-sm font-medium">
                      {divisiData.notulensi.length} Notulensi
                    </span>
                    {openDivisi[divisiName] ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Notulensi Content */}
              {openDivisi[divisiName] && (
                <div className="border-t border-gray-200">
                  <div className="p-6 space-y-4">
                    {divisiData.notulensi.map((notulen, index) => (
                      <div key={notulen.id} className="rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold">
                            {notulen.title}
                          </h3>
                          <span className="text-xs px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(notulen.date)}</span>
                          </div>

                          {notulen.location && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span>{notulen.location}</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-start gap-2 text-sm">
                            <FileText className="w-4 h-4 mt-0.5" />
                            <div>
                              <span className="font-medium">Agenda:</span>
                              <p>{notulen.agenda}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 text-sm">
                            <Users className="w-4 h-4 mt-0.5 " />
                            <div>
                              <span className="font-medium ">Peserta:</span>
                              <p>{notulen.attendees}</p>
                            </div>
                          </div>
                        </div>

                        {notulen.content && (
                          <div className="mt-3 p-3 rounded border">
                            <span className="text-sm font-medium">
                              Isi Notulensi:
                            </span>
                            <div
                              className="mt-2 text-sm prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(notulen.content)
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm">
          <p>
            Total: {data.length} notulensi dari{' '}
            {Object.keys(groupedByDivisi).length} divisi
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotulensiList
