'use client'
import { useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Printer } from 'lucide-react'
import LaporanAnggota from '@/components/reports/LaporanAnggota'
import LaporanProker from '@/components/reports/LaporanProker'
import LaporanRab from '@/components/reports/LaporanRab'
import LaporanProgresTugas from '@/components/reports/LaporanProgresTugas'
import LaporanTugasPerAnggota from '@/components/reports/LaporanTugasPerAnggota'
import LaporanNotulensi from '@/components/reports/LaporanNotulensi'
import LaporanKinerjaDivisi from '@/components/reports/LaporanKinerjaDivisi'
import LaporanStrukturKepanitiaan from '@/components/reports/LaporanStrukturKepanitiaan'
import Link from 'next/link'

export default function LaporanPage() {
  const [selectedReport, setSelectedReport] = useState('rab')
  const [rabFilter, setRabFilter] = useState('all')
  const [progresTugasFilter, setProgresTugasFilter] = useState('all')
  const [tugasAnggotaFilter, setTugasAnggotaFilter] = useState('all')

  const handleRabFilterChange = filter => {
    setRabFilter(filter)
  }

  const handleProgresTugasFilterChange = prokerId => {
    setProgresTugasFilter(prokerId)
  }

  const reportList = [
    {
      id: 'anggota',
      name: 'Laporan Daftar Anggota',
      url: '/laporan/daftar-anggota',
      component: <LaporanAnggota />
    },
    {
      id: 'proker',
      name: 'Laporan Daftar Program Kerja',
      url: '/laporan/daftar-proker',
      component: <LaporanProker />
    },
    {
      id: 'rab',
      name: 'Laporan Anggaran (RAB)',
      url: `/laporan/rab-proker/${rabFilter !== 'all' ? `?proker=${encodeURIComponent(rabFilter)}` : ''}`,
      component: <LaporanRab onFilterChange={handleRabFilterChange} />
    },
    {
      id: 'progres-tugas',
      name: 'Laporan Progres Tugas',
      url:
        progresTugasFilter !== 'all'
          ? `/laporan/progres-tugas/?prokerId=${progresTugasFilter}`
          : undefined,
      component: (
        <LaporanProgresTugas
          selectedProkerId={progresTugasFilter}
          onFilterChange={handleProgresTugasFilterChange}
        />
      )
    },
    {
      id: 'tugas-anggota',
      name: 'Laporan Tugas per Anggota',
      url: `/laporan/tugas-peranggota/?memberId=${tugasAnggotaFilter}`,
      component: (
        <LaporanTugasPerAnggota
          selectedMemberId={tugasAnggotaFilter}
          onFilterChange={setTugasAnggotaFilter}
        />
      )
    },
    {
      id: 'notulensi',
      name: 'Laporan Notulensi Rapat',
      component: <LaporanNotulensi />
    },
    {
      id: 'kinerja-divisi',
      name: 'Laporan Kinerja Divisi',
      url: '/laporan/kinerja-divisi',
      component: <LaporanKinerjaDivisi />
    },
    {
      id: 'struktur-kepanitiaan',
      name: 'Laporan Struktur Kepanitiaan',
      component: <LaporanStrukturKepanitiaan />
    }
  ]

  const handleReportChange = reportId => {
    const report = reportList.find(r => r.id === reportId)
    if (report) {
      setSelectedReport(reportId)
    }
  }

  const currentReport = reportList.find(r => r.id === selectedReport)

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
            defaultValue={selectedReport}
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
          {currentReport?.url && (
            <Link
              className={buttonVariants()}
              href={currentReport.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Printer className="mr-2 h-4 w-4" />
              Cetak
            </Link>
          )}
        </div>
      </div>
      <div className="p-6">
        {currentReport ? (
          currentReport.component
        ) : (
          <p>Pilih laporan untuk ditampilkan.</p>
        )}
      </div>
    </div>
  )
}
