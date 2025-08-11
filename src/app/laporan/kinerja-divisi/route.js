import { NextResponse } from 'next/server'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToStream
} from '@react-pdf/renderer'
import { auth, createClerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
})

// Function to chunk array into smaller arrays
const chunkArray = (array, chunkSize) => {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

// Function to format currency
const formatCurrency = amount => {
  if (typeof amount !== 'number') return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

// Component for page header (Disesuaikan)
const PageHeader = ({ orgName, pageNumber, totalPages }) => (
  <View style={styles.headerSection}>
    <Text style={styles.title}>LAPORAN KINERJA DIVIS</Text>
    <Text style={styles.subtitle}>
      {orgName?.toUpperCase() || 'ORGANISASI'}
    </Text>
    <View style={styles.pageInfo}>
      <Text style={styles.pageNumber}>
        Halaman {pageNumber} dari {totalPages}
      </Text>
    </View>
    <View style={styles.divider} />
  </View>
)

// Component for table header (Sama seperti Kinerja Divisi)
const ReportTableHeader = () => (
  <View style={[styles.tableRow, styles.headerRow]}>
    <Text style={[styles.tableCell, styles.headerCell, styles.noColumn]}>
      NO
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.divisiColumn]}>
      NAMA KEPANITIAAN/DIVISI
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.anggotaColumn]}>
      DAFTAR ANGGOTA
    </Text>
    <Text
      style={[styles.tableCell, styles.headerCell, styles.tugasSelesaiColumn]}
    >
      TUGAS SELESAI
    </Text>
    <Text
      style={[styles.tableCell, styles.headerCell, styles.tugasPendingColumn]}
    >
      TUGAS PENDING
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.rabColumn]}>
      ANGGARAN TERPAKAI
    </Text>
  </View>
)

// Component for page footer (Disesuaikan)
const PageFooter = ({ totalDivisi }) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>
      Total Kepanitiaan/Divisi: {totalDivisi}
    </Text>
    <Text style={styles.footerDate}>
      Dicetak pada:{' '}
      {new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </Text>
  </View>
)

export async function GET(_req) {
  try {
    const { userId, orgId } = await auth()
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organization = await clerk.organizations.getOrganization({
      organizationId: orgId
    })

    // --- MENGGABUNGKAN LOGIKA YANG ANDA BERIKAN ---

    // 1. Mengambil Divisi beserta Anggota (dari GET_DIVISIONS_WITH_MEMBERS_BY_ORG)
    const divisionsWithMembers = await prisma.divisi.findMany({
      where: { org_id: orgId },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        anggota: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    if (divisionsWithMembers.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada divisi/kepanitiaan ditemukan.' },
        { status: 404 }
      )
    }

    // 2. Mengambil Statistik Tugas (dari stats)
    const taskStats = await prisma.tugas.groupBy({
      by: ['divisiId', 'status'],
      where: { divisi: { org_id: orgId } },
      _count: { status: true }
    })
    const formattedTaskStats = taskStats.reduce((acc, stat) => {
      if (!stat.divisiId) return acc
      if (!acc[stat.divisiId]) {
        acc[stat.divisiId] = { SELESAI: 0 }
      }
      acc[stat.divisiId][stat.status] = stat._count.status
      return acc
    }, {})

    // 3. Mengambil Total RAB per Divisi (dari GET_TOTAL_RAB_BY_DIVISI)
    const rabItems = await prisma.rab.findMany({
      where: { divisi: { org_id: orgId } },
      select: { divisiId: true, harga: true, jumlah: true }
    })
    const rabTotals = rabItems.reduce((acc, item) => {
      if (!item.divisiId) return acc
      if (!acc[item.divisiId]) {
        acc[item.divisiId] = 0
      }
      acc[item.divisiId] += item.harga * item.jumlah
      return acc
    }, {})

    // 4. Menggabungkan semua data menjadi satu
    const reportData = divisionsWithMembers.map((divisi, index) => {
      const members =
        divisi.anggota.length > 0
          ? divisi.anggota
              .map(a =>
                `${a.user.firstName || ''} ${a.user.lastName || ''}`.trim()
              )
              .join(', ')
          : '-'

      const statsForDivisi = formattedTaskStats[divisi.id] || {}
      const completedTasks = statsForDivisi['SELESAI'] || 0
      const totalTasks = Object.values(statsForDivisi).reduce(
        (sum, count) => sum + count,
        0
      )
      const pendingTasks = totalTasks - completedTasks

      const rabUsed = rabTotals[divisi.id] || 0

      return {
        no: index + 1,
        name: divisi.name,
        members,
        completedTasks,
        pendingTasks,
        rabUsed
      }
    })

    // Pagination
    const itemsPerPage = 12
    const dataChunks = chunkArray(reportData, itemsPerPage)
    const totalPages = dataChunks.length

    const stream = await renderToStream(
      <Document>
        {dataChunks.map((pageData, pageIndex) => (
          <Page
            key={pageIndex}
            size="A4"
            orientation="landscape"
            style={styles.page}
          >
            <PageHeader
              orgName={organization.name}
              pageNumber={pageIndex + 1}
              totalPages={totalPages}
            />
            <View style={styles.tableContainer}>
              <ReportTableHeader />
              {pageData.map(item => (
                <View key={item.no} style={[styles.tableRow, styles.dataRow]}>
                  <Text
                    style={[styles.tableCell, styles.dataCell, styles.noColumn]}
                  >
                    {item.no}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.dataCell,
                      styles.divisiColumn
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.dataCell,
                      styles.anggotaColumn
                    ]}
                  >
                    {item.members}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.dataCell,
                      styles.tugasSelesaiColumn
                    ]}
                  >
                    {item.completedTasks}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.dataCell,
                      styles.tugasPendingColumn
                    ]}
                  >
                    {item.pendingTasks}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.dataCell,
                      styles.rabColumn
                    ]}
                  >
                    {formatCurrency(item.rabUsed)}
                  </Text>
                </View>
              ))}
            </View>
            <PageFooter totalDivisi={reportData.length} />
          </Page>
        ))}
      </Document>
    )

    const filename = `laporan-struktur-kepanitiaan-${organization.slug || 'org'}.pdf`
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Gagal membuat PDF', details: error.message },
      { status: 500 }
    )
  }
}

// Layout dan Style sama seperti Laporan Kinerja Divisi, hanya beberapa label yang disesuaikan
const styles = StyleSheet.create({
  page: { padding: 15, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  headerSection: { marginBottom: 12, alignItems: 'center' },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 4,
    textAlign: 'center'
  },
  subtitle: { fontSize: 10, color: '#4a5568' },
  pageInfo: { marginTop: 6, marginBottom: 3 },
  pageNumber: { fontSize: 9, color: '#718096', fontStyle: 'italic' },
  divider: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#e2e8f0',
    marginTop: 6
  },

  tableContainer: {
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    flex: 1
  },
  tableRow: { flexDirection: 'row', minHeight: 32 },
  headerRow: { backgroundColor: '#6366f1', minHeight: 28 },
  dataRow: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.25,
    borderBottomColor: '#f7fafc'
  },

  tableCell: {
    padding: 5,
    justifyContent: 'center',
    borderRightWidth: 0.25,
    borderRightColor: '#e2e8f0'
  },
  headerCell: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightColor: '#8b5cf6'
  },
  dataCell: { fontSize: 8, color: '#2d3748', lineHeight: 1.3 },

  noColumn: { width: '4%', textAlign: 'center' },
  divisiColumn: { width: '15%', textAlign: 'left', paddingLeft: 6 },
  anggotaColumn: { width: '36%', textAlign: 'left', paddingLeft: 6 },
  tugasSelesaiColumn: { width: '12%', textAlign: 'center' },
  tugasPendingColumn: { width: '12%', textAlign: 'center' },
  rabColumn: {
    width: '21%',
    textAlign: 'right',
    paddingRight: 6,
    borderRightWidth: 0
  },

  footer: {
    position: 'absolute',
    bottom: 5,
    left: 15,
    right: 15,
    paddingTop: 5,
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: { fontSize: 8, color: '#4a5568' },
  footerDate: { fontSize: 7, color: '#718096' }
})
