'use client'

import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import DataTable from '@/components/ui/DataTable'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const LaporanStrukturKepanitiaan = () => {
  const { orgId } = useAuth()
  const [selectedProkerFilter, setSelectedProkerFilter] = useState('all')

  const {
    data: strukturData,
    isLoading: isLoadingStruktur,
    error: errorStruktur
  } = useQuery({
    queryKey: ['laporan-struktur-kepanitiaan', orgId],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/laporan/struktur-kepanitiaan/${orgId}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch struktur kepanitiaan data')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  const { data: prokerList, isLoading: isLoadingProker } = useQuery({
    queryKey: ['proker-list-for-struktur-filter', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/proker/${orgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch proker list')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  const columns = useMemo(
    () => [
      {
        accessorKey: 'divisiName',
        header: 'Divisi'
      },
      {
        accessorKey: 'name',
        header: 'Nama Anggota'
      },
      {
        accessorKey: 'jabatan',
        header: 'Jabatan di Divisi'
      },
      {
        accessorKey: 'kontak',
        header: 'Kontak'
      }
    ],
    []
  )

  const handleProkerFilterChange = value => {
    setSelectedProkerFilter(value)
  }

  const filteredProkerData = useMemo(() => {
    if (!strukturData) return []
    if (selectedProkerFilter === 'all') {
      return strukturData
    } else {
      return strukturData.filter(proker => proker.id === selectedProkerFilter)
    }
  }, [strukturData, selectedProkerFilter])

  const allProkerOptions = useMemo(() => {
    const options =
      prokerList?.map(p => ({
        id: p.id,
        title: p.title
      })) || []
    return [{ id: 'all', title: 'Semua Program Kerja' }, ...options]
  }, [prokerList])

  if (isLoadingStruktur || isLoadingProker) return <p>Loading...</p>
  if (errorStruktur) return <p>Error: {errorStruktur.message}</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        Laporan Struktur Kepanitiaan per Program Kerja
      </h2>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-white">Filter berdasarkan Program Kerja:</span>
        <Select
          onValueChange={handleProkerFilterChange}
          defaultValue={selectedProkerFilter}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Pilih Program Kerja" />
          </SelectTrigger>
          <SelectContent>
            {allProkerOptions.map(option => (
              <SelectItem key={option.id} value={option.id}>
                {option.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredProkerData.length > 0 ? (
        filteredProkerData.map(proker => {
          const allMembersForProker = proker.divisi.reduce((acc, divisi) => {
            divisi.anggota.forEach(anggota => {
              acc.push({
                divisiName: divisi.name,
                name: `${anggota.user.firstName || ''} ${anggota.user.lastName || ''}`.trim(),
                jabatan: anggota.jenis_jabatan,
                kontak: anggota.user.telpon || anggota.user.email || '-'
              })
            })
            return acc
          }, [])

          return (
            <div
              key={proker.id}
              className="rounded-lg overflow-hidden border border-border mb-8"
            >
              <h3 className="text-lg font-semibold p-4 border-b border-border">
                Program Kerja: {proker.title}
              </h3>
              {allMembersForProker.length > 0 ? (
                <DataTable
                  data={allMembersForProker}
                  columns={columns}
                  isLoading={isLoadingStruktur}
                  enableGlobalFilter={false}
                />
              ) : (
                <p className="text-center text-muted-foreground p-4">
                  Tidak ada anggota di program kerja ini.
                </p>
              )}
            </div>
          )
        })
      ) : (
        <p className="text-center text-muted-foreground">
          Tidak ada data struktur kepanitiaan untuk program kerja yang dipilih.
        </p>
      )}
    </div>
  )
}

export default LaporanStrukturKepanitiaan
