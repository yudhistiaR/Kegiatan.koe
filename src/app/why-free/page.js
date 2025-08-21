'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Users,
  ArrowRight,
  Target,
  Heart,
  Globe,
  TrendingUp,
  Award,
  Lightbulb,
  HandHeart,
  CheckSquare,
  Shield
} from 'lucide-react'

// Import komponen yang baru dibuat
import { PageLayout } from '@/components/lendingPage/page-layout'
import { HeroSection } from '@/components/lendingPage/hero-section'
import { SectionHeader } from '@/components/lendingPage/section-header'
import { FeatureCard } from '@/components/lendingPage/feture-card'
import { ContentSection } from '@/components/lendingPage/content-section'

export default function MengapaGratisPage() {
  const impactStats = [
    { value: '10,000+', label: 'Mahasiswa Terdampak' },
    { value: '500+', label: 'Organisasi Aktif' },
    { value: '25,000+', label: 'Tugas Terselesaikan' }
  ]

  const philosophyFeatures = [
    {
      icon: Heart,
      title: 'Passion for Impact',
      description:
        'Kami lebih tertarik pada dampak positif yang bisa diciptakan daripada keuntungan finansial jangka pendek. Setiap organisasi yang berhasil menggunakan platform kami adalah kemenangan bagi kami.'
    },
    {
      icon: Globe,
      title: 'Democratizing Technology',
      description:
        'Teknologi manajemen organisasi yang baik seharusnya tidak hanya tersedia untuk perusahaan besar. Organisasi mahasiswa dan tim kecil juga berhak mendapat tools yang sama berkualitasnya.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation Through Accessibility',
      description:
        'Dengan menghilangkan barrier finansial, kami membuka kesempatan bagi lebih banyak organisasi untuk berinovasi dan berkembang dengan cara yang tidak pernah mereka bayangkan sebelumnya.'
    }
  ]

  const businessModelFeatures = [
    {
      icon: TrendingUp,
      title: 'Enterprise Services',
      description:
        'Kami menyediakan layanan konsultasi dan implementasi khusus untuk institusi besar yang membutuhkan customization dan support premium.'
    },
    {
      icon: Award,
      title: 'Strategic Partnerships',
      description:
        'Kerjasama dengan universitas, pemerintah, dan organisasi besar yang ingin mendukung ekosistem organisasi mahasiswa di Indonesia.'
    },
    {
      icon: Globe,
      title: 'Ecosystem Growth',
      description:
        'Semakin banyak organisasi yang sukses menggunakan platform kami, semakin besar value yang bisa kami tawarkan kepada partners dan stakeholders.'
    }
  ]

  const impactFeatures = [
    {
      icon: Users,
      title: 'Memberdayakan Generasi Muda',
      description:
        'Mahasiswa adalah pemimpin masa depan. Dengan memberikan tools terbaik, kami membantu mereka mengembangkan skill manajemen dan kepemimpinan yang akan berguna sepanjang karir mereka.'
    },
    {
      icon: Target,
      title: 'Meningkatkan Efektivitas Organisasi',
      description:
        'Organisasi yang lebih terorganisir dapat mencapai tujuan mereka dengan lebih efektif, yang pada akhirnya memberikan manfaat lebih besar kepada masyarakat.'
    },
    {
      icon: Globe,
      title: 'Membangun Ekosistem Kolaboratif',
      description:
        'Dengan platform yang sama, organisasi dapat lebih mudah berkolaborasi dan berbagi best practices satu sama lain.'
    }
  ]

  const commitments = [
    {
      icon: CheckSquare,
      title: 'Gratis Selamanya',
      description:
        'Platform inti akan selalu gratis untuk organisasi kecil dan menengah'
    },
    {
      icon: CheckSquare,
      title: 'No Hidden Agenda',
      description:
        'Tidak ada monetisasi data atau iklan yang mengganggu pengalaman pengguna'
    },
    {
      icon: CheckSquare,
      title: 'Continuous Improvement',
      description:
        'Kami akan terus mengembangkan fitur berdasarkan feedback komunitas'
    },
    {
      icon: CheckSquare,
      title: 'Open Communication',
      description:
        'Transparansi penuh tentang perkembangan platform dan keputusan bisnis'
    }
  ]

  return (
    <PageLayout currentPage="mengapa-gratis">
      {/* Hero Section */}
      <HeroSection
        badge="Komitmen Kami untuk Organisasi Indonesia"
        title={
          <>
            Mengapa <span className="text-[#4b6fd7]">Kegiatan.koe</span> Gratis?
          </>
        }
        description="Kami percaya bahwa setiap organisasi, terlepas dari ukuran atau budget, berhak mendapatkan tools terbaik untuk berkembang. Inilah cerita di balik keputusan kami untuk membuat Kegiatan.koe 100% gratis."
        secondaryButtonHref="/"
      />

      {/* Philosophy Section */}
      <ContentSection>
        <SectionHeader
          title="Filosofi Kami"
          description="Kegiatan.koe lahir dari keyakinan bahwa teknologi harus memberdayakan, bukan membatasi"
        />
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {philosophyFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#4b6fd7]/10 rounded-lg flex items-center justify-center mt-1">
                  <feature.icon className="w-6 h-6 text-[#4b6fd7]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative">
            <div className="bg-[#25294a] rounded-2xl p-8 border border-[#3d4166]">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-[#4b6fd7]/10 rounded-full flex items-center justify-center mx-auto">
                  <HandHeart className="w-10 h-10 text-[#4b6fd7]" />
                </div>
                <blockquote className="text-lg text-gray-300 italic">
                  {`"Kami percaya bahwa ketika organisasi berkembang, masyarakat
                  juga ikut berkembang. Itulah mengapa kami memilih untuk
                  memberikan yang terbaik tanpa meminta imbalan."`}
                </blockquote>
                <div className="text-white font-semibold">
                  - Tim Kegiatan.koe
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* Business Model Section */}
      <ContentSection backgroundColor="bg-[#25294a]">
        <SectionHeader
          title="Model Bisnis yang Berkelanjutan"
          description="Gratis bukan berarti tidak sustainable. Inilah bagaimana kami memastikan platform tetap berjalan"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {businessModelFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} centered />
          ))}
        </div>
        <div className="mt-16 text-center">
          <div className="bg-[#2d3154] rounded-2xl p-8 border border-[#3d4166] max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Transparansi Finansial
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Kami berkomitmen untuk selalu transparan tentang bagaimana kami
              membiayai operasional platform. Tidak ada agenda tersembunyi,
              tidak ada monetisasi data pengguna, dan tidak ada rencana untuk
              mengubah model gratis di masa depan. Platform ini akan tetap
              gratis untuk organisasi kecil dan menengah selamanya.
            </p>
          </div>
        </div>
      </ContentSection>

      {/* Impact Section */}
      <ContentSection>
        <SectionHeader
          title="Dampak yang Ingin Kami Capai"
          description="Setiap keputusan kami didasari oleh visi untuk menciptakan dampak positif yang berkelanjutan"
        />
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            {impactFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#4b6fd7]/10 rounded-lg flex items-center justify-center mt-1">
                  <feature.icon className="w-6 h-6 text-[#4b6fd7]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {impactStats.map((stat, index) => (
              <Card
                key={index}
                className="border border-[#3d4166] bg-[#2d3154]"
              >
                <CardHeader className="text-center">
                  <div className="text-4xl font-bold text-[#4b6fd7] mb-2">
                    {stat.value}
                  </div>
                  <CardTitle>{stat.label}</CardTitle>
                  <CardDescription>
                    {index === 0 &&
                      'Jumlah mahasiswa yang sudah merasakan manfaat dari organisasi yang menggunakan Kegiatan.koe'}
                    {index === 1 &&
                      'Organisasi mahasiswa dan tim kecil yang sudah menggunakan platform kami untuk berkembang'}
                    {index === 2 &&
                      'Jumlah tugas dan project yang berhasil diselesaikan dengan bantuan sistem manajemen kami'}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* Commitment Section */}
      <ContentSection backgroundColor="bg-[#25294a]">
        <div className="text-center space-y-8">
          <SectionHeader title="Komitmen Jangka Panjang" />
          <div className="bg-[#2d3154] rounded-2xl p-12 border border-[#3d4166] max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-[#4b6fd7]/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-10 h-10 text-[#4b6fd7]" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Janji Kami kepada Komunitas
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                {commitments.map((commitment, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <commitment.icon className="w-5 h-5 text-[#4b6fd7] mt-1" />
                    <p className="text-gray-300">
                      <strong className="text-white">
                        {commitment.title}:
                      </strong>{' '}
                      {commitment.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* FAQ Section */}
      <ContentSection>
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Pertanyaan Seputar Model Gratis"
            description="Jawaban untuk keraguan yang mungkin Anda miliki"
          />
          <div className="space-y-6">
            <Card className="border border-[#3d4166] bg-[#2d3154]">
              <CardHeader>
                <CardTitle className="text-white">
                  Bagaimana kalian bisa bertahan tanpa mengenakan biaya?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Kami memiliki model bisnis yang sustainable melalui layanan
                  enterprise untuk institusi besar, partnership strategis, dan
                  dukungan dari stakeholder yang percaya pada misi kami.
                  Platform untuk organisasi kecil akan tetap gratis selamanya.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-[#3d4166] bg-[#2d3154]">
              <CardHeader>
                <CardTitle className="text-white">
                  Apakah ada batasan fitur untuk pengguna gratis?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Tidak ada. Semua fitur inti tersedia untuk semua pengguna
                  tanpa batasan. Kami tidak menerapkan model freemium yang
                  membatasi fungsionalitas. Yang membedakan hanya layanan
                  support premium dan customization untuk enterprise.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-[#3d4166] bg-[#2d3154]">
              <CardHeader>
                <CardTitle className="text-white">
                  Apakah data kami aman jika platformnya gratis?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Keamanan data adalah prioritas utama kami, terlepas dari model
                  bisnis. Kami menggunakan enkripsi enterprise-grade, backup
                  otomatis, dan memenuhi standar compliance internasional.
                  Gratis tidak berarti kompromi pada keamanan.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-[#3d4166] bg-[#2d3154]">
              <CardHeader>
                <CardTitle className="text-white">
                  Bagaimana jika kalian bangkrut atau tutup?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Kami memiliki rencana kontinjensi yang jelas. Jika situasi
                  ekstrem terjadi, kami akan memberikan notice minimal 6 bulan
                  dan membantu migrasi data. Namun dengan model bisnis yang
                  sustainable dan dukungan komunitas yang kuat, kami optimis
                  untuk terus berkembang.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-[#3d4166] bg-[#2d3154]">
              <CardHeader>
                <CardTitle className="text-white">
                  Bisakah kami berkontribusi atau mendukung platform ini?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Tentu! Dukungan terbaik adalah dengan menggunakan platform dan
                  memberikan feedback. Kami juga menerima kontribusi dalam
                  bentuk case study, testimonial, atau referensi ke organisasi
                  lain. Untuk dukungan finansial atau partnership, silakan
                  hubungi tim kami.
                </p>
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
              Siap Bergabung dengan Misi Kami?
            </h2>
            <p className="text-xl text-primary-foreground/80">
              Jadilah bagian dari gerakan untuk memberdayakan organisasi
              Indonesia dengan teknologi terbaik
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 bg-white text-[#4b6fd7] hover:bg-gray-100"
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
              Bergabunglah dengan 500+ organisasi yang sudah mempercayai kami
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
