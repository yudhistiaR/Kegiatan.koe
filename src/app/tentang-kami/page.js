'use client'

import { Button } from '@/components/ui/button'
import {
  Users,
  ArrowRight,
  Target,
  Heart,
  Globe,
  Award,
  Lightbulb,
  Code,
  Palette,
  BarChart3,
  Shield,
  Mail
} from 'lucide-react'
import Link from 'next/link'

import { PageLayout } from '@/components/lendingPage/page-layout'
import { HeroSection } from '@/components/lendingPage/hero-section'
import { SectionHeader } from '@/components/lendingPage/section-header'
import { FeatureCard } from '@/components/lendingPage/feture-card'
import { TeamMemberCard } from '@/components/lendingPage/team-member-card'
import { TimelineItem } from '@/components/lendingPage/timeline-item'
import { ContactCard } from '@/components/lendingPage/contact-card'
import { StatsGrid } from '@/components/lendingPage/stats-grid'
import { ContentSection } from '@/components/lendingPage/content-section'

export default function TentangKamiPage() {
  const stats = [
    { value: '2023', label: 'Tahun Didirikan' },
    { value: '500+', label: 'Organisasi Aktif' },
    { value: '10K+', label: 'Pengguna Terdaftar' },
    { value: '100%', label: 'Gratis' }
  ]

  const teamMembers = [
    {
      name: 'M.Yudhistia Rahman',
      role: 'Co-Founder & CTO',
      description:
        'Ex-Ketua BEM dengan background Software Engineering. Passionate tentang teknologi yang memberdayakan komunitas.',
      icon: Code,
      socialLinks: [
        { type: 'email', url: 'mailto:yudhistia110@kegiatan.koe' },
        { type: 'linkedin', url: 'https://linkedin.com/in/yudhistia' },
        { type: 'github', url: 'https://github.com/yudhistia110' }
      ]
    },
    {
      name: 'M.Yudhistia Rahman',
      role: 'Co-Founder & CPO',
      description:
        'Ex-Ketua HIMA dengan expertise di Product Design dan User Experience. Fokus pada kemudahan penggunaan platform.',
      icon: Palette,
      socialLinks: [
        { type: 'email', url: 'mailto:yudhistia110@kegiatan.koe' },
        { type: 'linkedin', url: 'https://linkedin.com/in/yudhistia' },
        { type: 'github', url: 'https://github.com/yudhistia110' }
      ]
    },
    {
      name: 'M.Yudhistia Rahman',
      role: 'Head of Growth',
      description:
        'Ex-Koordinator UKM dengan pengalaman di community building dan partnership. Memimpin ekspansi platform ke seluruh Indonesia.',
      icon: BarChart3,
      socialLinks: [
        { type: 'email', url: 'mailto:yudhistia110@kegiatan.koe' },
        { type: 'linkedin', url: 'https://linkedin.com/in/yudhistia' },
        { type: 'github', url: 'https://github.com/yudhistia110' }
      ]
    }
  ]

  const timelineItems = [
    {
      step: 1,
      title: 'Januari 2023 - Ide Pertama',
      badge: 'Konsep',
      description:
        'Setelah mengalami kesulitan mengelola organisasi mahasiswa, tim founder mulai merancang solusi yang lebih baik dan accessible.'
    },
    {
      step: 2,
      title: 'Maret 2023 - MVP Development',
      badge: 'Development',
      description:
        'Mulai mengembangkan Minimum Viable Product dengan fitur dasar manajemen program kerja dan tugas.'
    },
    {
      step: 3,
      title: 'Juni 2023 - Beta Launch',
      badge: 'Launch',
      description:
        'Meluncurkan versi beta dengan 10 organisasi pilot dari berbagai universitas di Jakarta dan Bandung.'
    },
    {
      step: 4,
      title: 'September 2023 - Public Release',
      badge: 'Public',
      description:
        'Membuka platform untuk publik dengan fitur lengkap termasuk manajemen keuangan dan sistem pelaporan.'
    },
    {
      step: 5,
      title: 'Desember 2023 - 100+ Organisasi',
      badge: 'Milestone',
      description:
        'Mencapai 100+ organisasi aktif dan mulai ekspansi ke kota-kota besar lainnya di Indonesia.'
    },
    {
      step: 6,
      title: '2024 - 500+ Organisasi & Counting',
      badge: 'Present',
      description:
        'Kini melayani 500+ organisasi dengan 10,000+ pengguna aktif di seluruh Indonesia dan terus berkembang.'
    }
  ]

  return (
    <PageLayout currentPage="tentang-kami">
      {/* Hero Section */}
      <HeroSection
        badge="Cerita di Balik Kegiatan.koe"
        title={
          <>
            Tentang <span className="text-[#4b6fd7]">Kami</span>
          </>
        }
        description="Kami adalah tim yang passionate tentang memberdayakan organisasi Indonesia dengan teknologi terbaik. Berawal dari pengalaman pribadi dalam mengelola organisasi mahasiswa, kami memahami betul tantangan yang dihadapi setiap organisasi."
        secondaryButtonHref="/"
      />

      {/* Story Section */}
      <ContentSection>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Cerita Kami
            </h2>
            <div className="space-y-4 text-gray-300">
              <p className="text-lg leading-relaxed">
                Kegiatan.koe lahir dari frustrasi yang dialami tim kami saat
                mengelola berbagai organisasi mahasiswa. Kami sering mengalami
                kesulitan dalam koordinasi antar divisi, tracking progress
                tugas, dan mengelola keuangan organisasi.
              </p>
              <p className="text-lg leading-relaxed">
                Setelah mencoba berbagai tools yang ada, kami menyadari bahwa
                kebanyakan solusi yang tersedia terlalu kompleks, mahal, atau
                tidak sesuai dengan kebutuhan organisasi Indonesia. Dari sinilah
                ide untuk membuat platform yang sederhana, powerful, dan gratis
                mulai muncul.
              </p>
              <p className="text-lg leading-relaxed">
                Dimulai sebagai project sampingan pada tahun 2023, Kegiatan.koe
                kini telah berkembang menjadi platform yang dipercaya oleh
                ratusan organisasi di seluruh Indonesia.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-[#25294a] rounded-2xl p-8 border border-[#3d4166]">
              <StatsGrid stats={stats} columns={2} />
            </div>
          </div>
        </div>
      </ContentSection>

      {/* Mission & Vision Section */}
      <ContentSection backgroundColor="bg-[#25294a]">
        <SectionHeader
          title="Misi & Visi Kami"
          description="Panduan yang mengarahkan setiap keputusan dan inovasi yang kami buat"
        />
        <div className="grid md:grid-cols-2 gap-12">
          <FeatureCard
            icon={Target}
            title="Misi Kami"
            description="Memberdayakan setiap organisasi di Indonesia dengan menyediakan platform manajemen yang sederhana, powerful, dan accessible untuk semua, tanpa memandang ukuran atau budget organisasi."
            centered
          />
          <FeatureCard
            icon={Globe}
            title="Visi Kami"
            description="Menjadi platform #1 untuk manajemen organisasi di Indonesia, di mana setiap organisasi dapat mencapai potensi maksimal mereka dan berkontribusi positif bagi masyarakat."
            centered
          />
        </div>
      </ContentSection>

      {/* Values Section */}
      <ContentSection>
        <SectionHeader
          title="Nilai-Nilai Kami"
          description="Prinsip-prinsip yang menjadi fondasi dalam setiap yang kami lakukan"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={Heart}
            title="Impact First"
            description="Setiap keputusan kami didasari oleh dampak positif yang bisa diciptakan untuk komunitas"
            centered
          />
          <FeatureCard
            icon={Users}
            title="User-Centric"
            description="Pengguna adalah pusat dari semua yang kami lakukan. Feedback mereka adalah prioritas utama"
            centered
          />
          <FeatureCard
            icon={Lightbulb}
            title="Innovation"
            description="Kami selalu mencari cara baru dan lebih baik untuk memecahkan masalah organisasi"
            centered
          />
          <FeatureCard
            icon={Shield}
            title="Transparency"
            description="Keterbukaan dan kejujuran dalam setiap aspek bisnis dan pengembangan produk"
            centered
          />
        </div>
      </ContentSection>

      {/* Team Section */}
      <ContentSection backgroundColor="bg-[#25294a]">
        <SectionHeader
          title="Tim Kami"
          description="Orang-orang passionate yang bekerja keras untuk mewujudkan visi Kegiatan.koe"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} {...member} />
          ))}
        </div>
        <div className="text-center mt-12">
          <p className="text-gray-300 text-lg mb-6">
            Kami juga didukung oleh kontributor dan advisor dari berbagai
            universitas dan organisasi di Indonesia
          </p>
          <Button
            variant="outline"
            className="border-[#4b6fd7] text-white hover:bg-[#4b6fd7] bg-transparent"
          >
            Bergabung dengan Tim Kami
          </Button>
        </div>
      </ContentSection>

      {/* Journey/Timeline Section */}
      <ContentSection>
        <SectionHeader
          title="Perjalanan Kami"
          description="Milestone penting dalam pengembangan Kegiatan.koe"
        />
        <div className="space-y-8">
          {timelineItems.map((item, index) => (
            <TimelineItem key={index} {...item} />
          ))}
        </div>
      </ContentSection>

      {/* Contact Section */}
      <ContentSection backgroundColor="bg-[#25294a]">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Mari Berkenalan"
            description="Punya pertanyaan, saran, atau ingin berkolaborasi? Kami senang mendengar dari Anda"
          />
          <div className="grid md:grid-cols-3 gap-8">
            <ContactCard
              icon={Mail}
              title="Email Kami"
              description="hello@kegiatan.koe"
              onClick={() => window.open('mailto:hello@kegiatan.koe')}
            />
            <ContactCard
              icon={Users}
              title="Komunitas"
              description="Join Discord Community"
              onClick={() => window.open('https://discord.gg/kegiatan-koe')}
            />
            <ContactCard
              icon={Award}
              title="Partnership"
              description="partnership@kegiatan.koe"
              onClick={() => window.open('mailto:partnership@kegiatan.koe')}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              size="lg"
              className="bg-[#4b6fd7] hover:bg-[#4b6fd7]/90 text-primary-foreground text-lg px-8"
            >
              Hubungi Kami
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 border-[#3d4166] text-white hover:bg-muted bg-transparent"
            >
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
