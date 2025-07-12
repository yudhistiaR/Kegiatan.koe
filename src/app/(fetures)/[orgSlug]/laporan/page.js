'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Printer } from 'lucide-react'
import LaporanAnggota from '@/components/reports/LaporanAnggota'
import LaporanProker from '@/components/reports/LaporanProker'
import LaporanRab from '@/components/reports/LaporanRab'
import LaporanProgresTugas from '@/components/reports/LaporanProgresTugas'
import LaporanTugasPerAnggota from '@/components/reports/LaporanTugasPerAnggota'
import LaporanNotulensi from '@/components/reports/LaporanNotulensi'
import LaporanKinerjaDivisi from '@/components/reports/LaporanKinerjaDivisi'
import LaporanStrukturKepanitiaan from '@/components/reports/LaporanStrukturKepanitiaan'

// --- Placeholder Components & Data ---
// Di dunia nyata, ini akan mengambil data dari API Anda.

const ReportSkeleton = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-8 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
      </div>
    </div>
  </div>
)

const reportList = [
  {
    id: 'anggota',
    name: 'Laporan Daftar Anggota',
    component: <LaporanAnggota />
  },
  {
    id: 'proker',
    name: 'Laporan Daftar Program Kerja',
    component: <LaporanProker />
  },
  { id: 'rab', name: 'Laporan Anggaran (RAB)', component: <LaporanRab /> },
  {
    id: 'progres-tugas',
    name: 'Laporan Progres Tugas',
    component: <LaporanProgresTugas />
  },
  {
    id: 'tugas-anggota',
    name: 'Laporan Tugas per Anggota',
    component: <LaporanTugasPerAnggota />
  },
  {
    id: 'notulensi',
    name: 'Laporan Notulensi Rapat',
    component: <LaporanNotulensi />
  },
  {
    id: 'kinerja-divisi',
    name: 'Laporan Kinerja Divisi',
    component: <LaporanKinerjaDivisi />
  },
  {
    id: 'struktur-kepanitiaan',
    name: 'Laporan Struktur Kepanitiaan',
    component: <LaporanStrukturKepanitiaan />
  }
]

export default function LaporanPage() {
  const [selectedReport, setSelectedReport] = useState(reportList[0])

  const handleReportChange = reportId => {
    const report = reportList.find(r => r.id === reportId)
    if (report) {
      setSelectedReport(report)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Pusat Laporan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pilih, lihat, dan cetak laporan untuk organisasi Anda.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            onValueChange={handleReportChange}
            defaultValue={selectedReport.id}
          >
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder="Pilih Jenis Laporan" />
            </SelectTrigger>
            <SelectContent>
              {reportList.map(report => (
                <SelectItem key={report.id} value={report.id}>
                  {report.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
        </div>
      </div>
      <div className="p-6">
        {selectedReport ? (
          selectedReport.component
        ) : (
          <p>Pilih laporan untuk ditampilkan.</p>
        )}
      </div>
    </div>
  )
}
