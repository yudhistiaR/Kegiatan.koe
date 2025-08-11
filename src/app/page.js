'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Calendar,
  CheckSquare,
  DollarSign,
  FileText,
  BarChart3,
  ArrowRight,
  Shield,
  Zap,
  Target
} from 'lucide-react'
import Image from 'next/image'

import { PageLayout } from '@/components/lendingPage/page-layout'
import { SectionHeader } from '@/components/lendingPage/section-header'
import { FeatureCard } from '@/components/lendingPage/feture-card'
import { StatsGrid } from '@/components/lendingPage/stats-grid'
import { ContentSection } from '@/components/lendingPage/content-section'

export default function LandingPage() {
  const stats = [
    { value: '500+', label: 'Organisasi Aktif' },
    { value: '10K+', label: 'Pengguna Terdaftar' },
    { value: '25K+', label: 'Tugas Diselesaikan' },
    { value: '100%', label: 'Gratis' }
  ]

  const features = [
    {
      icon: Calendar,
      title: 'Manajemen Program Kerja',
      description:
        'Rencanakan, kelola, dan pantau semua program kerja organisasi dalam satu tempat'
    },
    {
      icon: CheckSquare,
      title: 'Kanban Board',
      description:
        'Visualisasi tugas dengan papan Kanban yang intuitif. Drag & drop untuk update status'
    },
    {
      icon: Users,
      title: 'Manajemen Divisi',
      description:
        'Organisir anggota dalam divisi dengan peran dan tanggung jawab yang jelas'
    },
    {
      icon: DollarSign,
      title: 'Manajemen Keuangan',
      description:
        'Kelola RAB (Rencana Anggaran Biaya) dan pantau pengeluaran dengan mudah'
    },
    {
      icon: FileText,
      title: 'Notulensi Digital',
      description:
        'Catat dan kelola notulensi rapat dengan sistem yang terorganisir'
    },
    {
      icon: BarChart3,
      title: 'Laporan Komprehensif',
      description:
        'Generate berbagai laporan: kinerja divisi, progres tugas, laporan keuangan'
    }
  ]

  const targetAudience = [
    {
      icon: Users,
      title: 'Organisasi Mahasiswa',
      description:
        'BEM, HIMA, UKM, dan organisasi kampus lainnya yang membutuhkan koordinasi yang efektif'
    },
    {
      icon: Target,
      title: 'Tim Proyek',
      description:
        'Tim kecil yang mengerjakan proyek dengan deadline dan anggaran yang perlu dikelola'
    },
    {
      icon: Calendar,
      title: 'Event Organizer',
      description:
        'Panitia acara yang membutuhkan koordinasi divisi dan manajemen tugas yang terstruktur'
    }
  ]

  const whyFreeFeatures = [
    {
      icon: Users,
      title: 'Memberdayakan Organisasi',
      description:
        'Kami ingin semua organisasi, terlepas dari budget, dapat berkembang dengan tools yang tepat'
    },
    {
      icon: Target,
      title: 'Fokus pada Impact',
      description:
        'Daripada mencari profit, kami fokus pada dampak positif untuk komunitas organisasi Indonesia'
    },
    {
      icon: Calendar,
      title: 'Sustainable Growth',
      description:
        'Model bisnis kami berkelanjutan melalui partnership dan layanan enterprise untuk institusi besar'
    }
  ]

  return (
    <PageLayout currentPage="home">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-[#25294a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-[#4b6fd7]/20 text-[#4b6fd7] border-[#4b6fd7]/30"
                >
                  Platform Manajemen Organisasi Terpadu
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  Kelola Organisasi Anda dengan{' '}
                  <span className="text-[#4b6fd7]">Lebih Efisien</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Satu platform untuk mengelola program kerja, tugas, divisi,
                  keuangan, dan pelaporan organisasi mahasiswa atau tim kecil
                  Anda. Sepenuhnya gratis!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#4b6fd7] hover:bg-[#4b6fd7]/90 text-primary-foreground text-lg px-8"
                >
                  Mulai Gratis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 border-[#3d4166] text-white hover:bg-muted bg-transparent"
                >
                  Lihat Demo
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>100% Gratis Selamanya</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>Setup dalam 5 menit</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#2d3154] rounded-2xl shadow-2xl p-6 border border-[#3d4166]">
                <Image
                  src="/dashboard.png"
                  alt="Kegiatan.koe Dashboard"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-[#4b6fd7] text-primary-foreground p-3 rounded-full shadow-lg">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <ContentSection>
        <SectionHeader
          title="Semua yang Anda Butuhkan dalam Satu Platform"
          description="Dari perencanaan hingga pelaporan, Kegiatan.koe menyediakan tools lengkap untuk mengelola organisasi Anda"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </ContentSection>

      {/* Target Audience Section */}
      <ContentSection backgroundColor="bg-[#25294a]">
        <SectionHeader
          title="Dibuat Khusus untuk Organisasi Anda"
          description="Platform yang dirancang untuk kebutuhan organisasi mahasiswa dan tim kecil"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {targetAudience.map((audience, index) => (
            <FeatureCard key={index} {...audience} centered />
          ))}
        </div>
      </ContentSection>

      {/* Why Free Section */}
      <ContentSection>
        <SectionHeader
          title="Mengapa Kegiatan.koe Gratis?"
          description="Kami percaya setiap organisasi berhak mendapat tools terbaik tanpa hambatan biaya"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {whyFreeFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} centered />
          ))}
        </div>
      </ContentSection>

      {/* Stats Section */}
      <ContentSection>
        <SectionHeader
          title="Dipercaya oleh Ribuan Organisasi"
          description="Bergabunglah dengan ribuan organisasi yang sudah merasakan manfaat platform gratis terbaik"
        />
        <StatsGrid stats={stats} />
      </ContentSection>

      {/* How It Works Section */}
      <ContentSection backgroundColor="bg-[#25294a]">
        <SectionHeader
          title="Cara Kerja Kegiatan.koe"
          description="Mulai kelola organisasi Anda dalam 3 langkah mudah"
        />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#4b6fd7] rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Daftar & Setup</h3>
            <p className="text-gray-300">
              Buat akun gratis, setup organisasi Anda, dan undang anggota tim
              dalam hitungan menit
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#4b6fd7] rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white">
              Buat Program Kerja
            </h3>
            <p className="text-gray-300">
              Rencanakan program kerja, bagi ke dalam divisi, dan assign tugas
              kepada anggota tim
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#4b6fd7] rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white">
              Monitor & Laporan
            </h3>
            <p className="text-gray-300">
              Pantau progress real-time dan generate laporan komprehensif untuk
              evaluasi
            </p>
          </div>
        </div>
      </ContentSection>

      {/* FAQ Section */}
      <ContentSection>
        <SectionHeader
          title="Pertanyaan yang Sering Diajukan"
          description="Temukan jawaban untuk pertanyaan umum tentang Kegiatan.koe"
        />
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border border-[#3d4166] bg-[#2d3154]">
            <CardHeader>
              <CardTitle className="text-white">
                Apakah Kegiatan.koe benar-benar gratis?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Ya, Kegiatan.koe 100% gratis tanpa batasan jumlah anggota atau
                fitur.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[#3d4166] bg-[#2d3154]">
            <CardHeader>
              <CardTitle className="text-white">
                Bagaimana cara mengundang anggota tim?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Anda dapat mengundang anggota melalui email dari dashboard
                admin. Mereka akan menerima link undangan untuk bergabung dengan
                organisasi Anda.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[#3d4166] bg-[#2d3154]">
            <CardHeader>
              <CardTitle className="text-white">
                Apakah data kami aman?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Keamanan data adalah prioritas utama kami. Semua data dienkripsi
                dengan standar enterprise-grade dan di-backup secara otomatis.
                Kami juga memenuhi standar compliance internasional.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[#3d4166] bg-[#2d3154]">
            <CardHeader>
              <CardTitle className="text-white">
                Bisakah saya mengekspor data organisasi?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Ya, Anda dapat mengekspor semua data organisasi dalam format
                Excel atau PDF kapan saja. Fitur ini tersedia di semua paket.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[#3d4166] bg-[#2d3154]">
            <CardHeader>
              <CardTitle className="text-white">
                Apakah ada dukungan pelanggan?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Kami menyediakan dukungan email untuk semua pengguna. Pengguna
                paket Pro dan Enterprise mendapat priority support dengan
                response time yang lebih cepat.
              </p>
            </CardContent>
          </Card>
        </div>
      </ContentSection>

      {/* Blog/Resources Section */}
      <ContentSection>
        <SectionHeader
          title="Resources & Tips"
          description="Pelajari cara memaksimalkan produktivitas organisasi Anda"
        />
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border border-[#3d4166] bg-[#2d3154] hover:border-[#4b6fd7]/50 transition-colors">
            <CardHeader>
              <div className="w-full h-48 bg-[#4b6fd7]/10 rounded-lg mb-4 flex items-center justify-center">
                <FileText className="w-12 h-12 text-[#4b6fd7]" />
              </div>
              <CardTitle>5 Tips Mengelola Program Kerja yang Efektif</CardTitle>
              <CardDescription>
                Pelajari strategi terbaik untuk merencanakan dan menjalankan
                program kerja organisasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="border-[#4b6fd7] text-white hover:bg-[#4b6fd7] bg-transparent"
              >
                Baca Artikel
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-[#3d4166] bg-[#2d3154] hover:border-[#4b6fd7]/50 transition-colors">
            <CardHeader>
              <div className="w-full h-48 bg-[#4b6fd7]/10 rounded-lg mb-4 flex items-center justify-center">
                <Users className="w-12 h-12 text-[#4b6fd7]" />
              </div>
              <CardTitle>Cara Membangun Tim yang Solid</CardTitle>
              <CardDescription>
                Tips dan trik untuk meningkatkan kolaborasi dan komunikasi dalam
                tim organisasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="border-[#4b6fd7] text-white hover:bg-[#4b6fd7] bg-transparent"
              >
                Baca Artikel
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-[#3d4166] bg-[#2d3154] hover:border-[#4b6fd7]/50 transition-colors">
            <CardHeader>
              <div className="w-full h-48 bg-[#4b6fd7]/10 rounded-lg mb-4 flex items-center justify-center">
                <DollarSign className="w-12 h-12 text-[#4b6fd7]" />
              </div>
              <CardTitle>Mengelola Keuangan Organisasi</CardTitle>
              <CardDescription>
                Panduan lengkap untuk membuat dan mengelola anggaran organisasi
                yang sehat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="border-[#4b6fd7] text-white hover:bg-[#4b6fd7] bg-transparent"
              >
                Baca Artikel
              </Button>
            </CardContent>
          </Card>
        </div>
      </ContentSection>

      {/* Contact Section */}
      <ContentSection backgroundColor="bg-[#25294a]">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Hubungi Kami"
            description="Punya pertanyaan atau butuh bantuan? Tim kami siap membantu Anda"
          />
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#4b6fd7]/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#4b6fd7]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Sales & Demo
                    </h3>
                    <p className="text-gray-300">sales@kegiatan.koe</p>
                    <p className="text-gray-300">+62 812-3456-7890</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#4b6fd7]/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#4b6fd7]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Technical Support
                    </h3>
                    <p className="text-gray-300">support@kegiatan.koe</p>
                    <p className="text-gray-300">Response time: 24 jam</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#4b6fd7]/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#4b6fd7]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Partnership
                    </h3>
                    <p className="text-gray-300">partnership@kegiatan.koe</p>
                    <p className="text-gray-300">Kerjasama & Integrasi</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border border-[#3d4166] bg-[#2d3154]">
              <CardHeader>
                <CardTitle>Kirim Pesan</CardTitle>
                <CardDescription>
                  Kami akan merespon dalam 24 jam
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Nama</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-[#25294a] border border-[#3d4166] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#4b6fd7]"
                    placeholder="Nama lengkap Anda"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-[#25294a] border border-[#3d4166] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#4b6fd7]"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Pesan
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 bg-[#25294a] border border-[#3d4166] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#4b6fd7]"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>
                <Button className="w-full bg-[#4b6fd7] hover:bg-[#3d5bc7] text-white">
                  Kirim Pesan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ContentSection>

      {/* CTA Section */}
      <section className="py-20 bg-[#4b6fd7]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
              Siap Mengorganisir dengan Lebih Baik?
            </h2>
            <p className="text-xl text-primary-foreground/80">
              Bergabunglah dengan ribuan organisasi yang sudah menggunakan
              platform gratis terbaik
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 bg-secondary text-foreground hover:bg-background hover:text-muted"
              >
                Mulai Sekarang - Selamanya Gratis!
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                Hubungi Tim Kami
              </Button>
            </div>
            <p className="text-primary-foreground/70 text-sm">
              100% gratis selamanya • Tidak ada biaya tersembunyi • Tidak perlu
              kartu kredit
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
