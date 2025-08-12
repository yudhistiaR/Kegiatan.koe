'use client'

import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { formatDate } from '@/helpers/formatedate'
import DataTable from '@/components/ui/DataTable'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

// --- DIUBAH: Menerima props selectedMemberId dan onFilterChange ---
const LaporanTugasPerAnggota = ({ selectedMemberId, onFilterChange }) => {
  const { orgId } = useAuth()

  // --- DIHAPUS: State lokal tidak lagi digunakan ---
  // const [selectedMemberFilter, setSelectedMemberFilter] = useState('all')

  const {
    data: tugasData,
    isLoading: isLoadingTugas,
    error: errorTugas
  } = useQuery({
    queryKey: ['laporan-tugas-per-anggota', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/tugas-per-anggota/${orgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tugas data')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  const { data: membersList, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['members-list-for-tugas-filter', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/anggota/${orgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch members list')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  // --- DIUBAH: Logika filter menggunakan prop selectedMemberId ---
  const filteredAndGroupedData = useMemo(() => {
    if (!tugasData) return {}

    const grouped = {}

    tugasData.forEach(task => {
      task.assignedTo.forEach(assignee => {
        const memberName =
          `${assignee.user.firstName} ${assignee.user.lastName}`.trim()
        const memberId = assignee.user.id

        if (selectedMemberId === 'all' || selectedMemberId === memberId) {
          if (!grouped[memberName]) {
            grouped[memberName] = []
          }
          grouped[memberName].push({
            name: task.name,
            prokerTitle: task.proker.title,
            status: task.status,
            end: task.end
          })
        }
      })
    })

    return grouped
  }, [tugasData, selectedMemberId])

  const allMembers = useMemo(() => {
    const members =
      membersList?.map(m => ({
        id: m.user.id,
        name: `${m.user.firstName} ${m.user.lastName}`.trim()
      })) || []
    return [{ id: 'all', name: 'Semua Anggota' }, ...members]
  }, [membersList])

  // --- DIHAPUS: Handler lokal tidak lagi digunakan ---
  // const handleMemberFilterChange = value => {
  //   setSelectedMemberFilter(value)
  // }

  const columns = useMemo(
    () => [
      {
        header: 'No',
        cell: ({ row }) => row.index + 1,
        size: 50
      },
      {
        accessorKey: 'name',
        header: 'Nama Tugas'
      },
      {
        accessorKey: 'prokerTitle',
        header: 'Asal Program Kerja'
      },
      {
        accessorKey: 'status',
        header: 'Status Tugas'
      },
      {
        accessorKey: 'end',
        header: 'Batas Waktu',
        cell: ({ getValue }) => formatDate(getValue())
      }
    ],
    []
  )

  if (isLoadingTugas || isLoadingMembers) return <p>Loading...</p>
  if (errorTugas) return <p>Error: {errorTugas.message}</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="text-white">Filter berdasarkan Anggota:</span>
        {/* --- DIUBAH: Select dikontrol oleh props dari induk --- */}
        <Select onValueChange={onFilterChange} value={selectedMemberId}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Pilih Anggota" />
          </SelectTrigger>
          <SelectContent>
            {allMembers.map(member => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {Object.entries(filteredAndGroupedData).length > 0 ? (
        Object.entries(filteredAndGroupedData).map(([memberName, tasks]) => (
          <div
            key={memberName}
            className="rounded-lg overflow-hidden border border-border py-4"
          >
            <h3 className="text-lg font-semibold p-4 border-b border-border">
              {memberName}
            </h3>
            <DataTable
              data={tasks}
              columns={columns}
              isLoading={isLoadingTugas}
              enableGlobalFilter={false}
            />
          </div>
        ))
      ) : (
        <p className="text-center text-muted-foreground">
          Tidak ada data tugas untuk anggota yang dipilih.
        </p>
      )}
    </div>
  )
}

export default LaporanTugasPerAnggota
