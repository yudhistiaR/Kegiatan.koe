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

// Function to format date
const formatDate = dateString => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// --- BARU: Function to group Tugas items by Member ---
const groupTugasByMember = tugasItems => {
  const grouped = {}
  tugasItems.forEach(task => {
    task.assignedTo.forEach(assignee => {
      const memberName =
        `${assignee.user.firstName} ${assignee.user.lastName}`.trim() ||
        assignee.user.username
      const memberId = assignee.user.id

      if (!grouped[memberName]) {
        grouped[memberName] = { tasks: [], memberId: memberId }
      }
      grouped[memberName].tasks.push({
        name: task.name,
        prokerTitle: task.proker.title,
        status: task.status,
        end: task.end
      })
    })
  })
  return grouped
}

// --- Component for Page Header (Judul Diubah) ---
const PageHeader = ({ orgName, pageNumber, totalPages, filterInfo }) => (
  <View style={styles.headerSection}>
    <Text style={styles.title}>LAPORAN TUGAS PER ANGGOTA</Text>
    <Text style={styles.subtitle}>
      {orgName?.toUpperCase() || 'ORGANISASI'}
    </Text>
    {filterInfo && filterInfo !== 'Semua Anggota' && (
      <Text style={styles.filterInfo}>Filter Aktif: {filterInfo}</Text>
    )}
    <View style={styles.pageInfo}>
      <Text style={styles.pageNumber}>
        Halaman {pageNumber} dari {totalPages}
      </Text>
    </View>
    <View style={styles.divider} />
  </View>
)

// --- BARU: Component for Member's Task Table Header ---
const MemberTaskTableHeader = () => (
  <View style={[styles.tableRow, styles.headerRow]}>
    <Text style={[styles.tableCell, styles.headerCell, styles.noColumn]}>
      NO
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.namaTugasColumn]}>
      NAMA TUGAS
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.prokerColumn]}>
      PROGRAM KERJA
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.statusColumn]}>
      STATUS
    </Text>
    <Text
      style={[styles.tableCell, styles.headerCell, styles.batasWaktuColumn]}
    >
      BATAS WAKTU
    </Text>
  </View>
)

// --- Component for Page Footer (Info Diubah) ---
const PageFooter = ({ totalTugas, totalAnggota }) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>
      Total Anggota: {totalAnggota} | Total Tugas: {totalTugas}
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

// --- BARU: Component for "No Data" Page ---
const NoDataPage = ({ organization, filterInfo }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <PageHeader
        orgName={organization.name}
        pageNumber={1}
        totalPages={1}
        filterInfo={filterInfo}
      />
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>Tidak Ada Data Tugas Ditemukan</Text>
        <Text style={styles.noDataSubText}>
          {filterInfo && filterInfo !== 'Semua Anggota'
            ? `Anggota "${filterInfo}" tidak memiliki tugas.`
            : 'Belum ada tugas yang ditugaskan kepada anggota manapun.'}
        </Text>
      </View>
      <PageFooter totalTugas={0} totalAnggota={0} />
    </Page>
  </Document>
)

export async function GET(req) {
  try {
    const { userId, orgId } = await auth()
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const memberId = searchParams.get('memberId') || 'all'

    const organization = await clerk.organizations.getOrganization({
      organizationId: orgId
    })

    // --- DIUBAH: Logika pengambilan data ---
    let memberFilterClause = {}
    let selectedMemberName = 'Semua Anggota'

    if (memberId && memberId !== 'all') {
      memberFilterClause = {
        assignedTo: {
          some: {
            userId: memberId
          }
        }
      }
      // Ambil nama anggota untuk ditampilkan di header
      const memberUser = await clerk.users.getUser(memberId)
      selectedMemberName =
        `${memberUser.firstName} ${memberUser.lastName}`.trim() ||
        memberUser.username
    }

    const listTugas = await prisma.tugas.findMany({
      where: {
        proker: {
          org_id: orgId
        },
        ...memberFilterClause
      },
      orderBy: [{ proker: { start: 'asc' } }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        status: true,
        end: true,
        proker: {
          select: {
            title: true
          }
        },
        assignedTo: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    // --- DIUBAH: Logika grouping & penanganan data kosong ---
    const groupedData = groupTugasByMember(listTugas)

    if (Object.keys(groupedData).length === 0) {
      const stream = await renderToStream(
        <NoDataPage
          organization={organization}
          filterInfo={selectedMemberName}
        />
      )
      const filename = `laporan-tugas-anggota-kosong.pdf`
      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      })
    }

    const totalTugasCount = listTugas.length
    const totalAnggotaCount = Object.keys(groupedData).length
    const tasksPerPage = 25

    const pages = []
    let globalPageNumber = 1

    Object.entries(groupedData).forEach(([memberName, memberData]) => {
      let itemIndexInMember = 1
      const chunks = []
      for (let i = 0; i < memberData.tasks.length; i += tasksPerPage) {
        chunks.push(memberData.tasks.slice(i, i + tasksPerPage))
      }

      chunks.forEach((chunk, chunkIndex) => {
        pages.push({
          memberName,
          tasks: chunk,
          isFirstPageOfMember: chunkIndex === 0,
          pageNumber: globalPageNumber++,
          startIndex: itemIndexInMember
        })
        itemIndexInMember += chunk.length
      })
    })

    const totalPages = pages.length

    const stream = await renderToStream(
      <Document>
        {pages.map((pageData, pageIndex) => (
          <Page key={pageIndex} size="A4" style={styles.page}>
            <PageHeader
              orgName={organization.name}
              pageNumber={pageData.pageNumber}
              totalPages={totalPages}
              filterInfo={selectedMemberName}
            />

            {pageData.isFirstPageOfMember && (
              <View style={styles.memberSection}>
                <Text style={styles.memberName}>
                  Tugas untuk: {pageData.memberName}
                </Text>
              </View>
            )}

            <View style={styles.tableContainer}>
              <MemberTaskTableHeader />
              {pageData.tasks.map((tugas, index) => (
                <View
                  key={`${pageIndex}-${index}`}
                  style={[styles.tableRow, styles.dataRow]}
                >
                  <Text
                    style={[styles.tableCell, styles.dataCell, styles.noColumn]}
                  >
                    {pageData.startIndex + index}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.dataCell,
                      styles.namaTugasColumn
                    ]}
                  >
                    {tugas.name}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.dataCell,
                      styles.prokerColumn
                    ]}
                  >
                    {tugas.prokerTitle}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.dataCell,
                      styles.statusColumn
                    ]}
                  >
                    {tugas.status}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.dataCell,
                      styles.batasWaktuColumn
                    ]}
                  >
                    {formatDate(tugas.end)}
                  </Text>
                </View>
              ))}
            </View>

            <PageFooter
              totalTugas={totalTugasCount}
              totalAnggota={totalAnggotaCount}
            />
          </Page>
        ))}
      </Document>
    )

    const filename = `laporan-tugas-per-anggota-${organization.slug || 'organisasi'}.pdf`

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

const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  headerSection: { marginBottom: 12, alignItems: 'center' },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 4
  },
  subtitle: { fontSize: 10, color: '#4a5568' },
  filterInfo: {
    fontSize: 9,
    color: '#c026d3',
    fontStyle: 'italic',
    marginTop: 4
  },
  pageInfo: { marginTop: 4, marginBottom: 3 },
  pageNumber: { fontSize: 9, color: '#718096', fontStyle: 'italic' },
  divider: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#e2e8f0',
    marginTop: 6
  },

  memberSection: {
    backgroundColor: '#f1f5f9',
    padding: 8,
    marginBottom: 8,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: '#4f46e5'
  },
  memberName: { fontSize: 12, fontWeight: 'bold', color: '#4338ca' },

  tableContainer: {
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    flex: 1
  },
  tableRow: { flexDirection: 'row', minHeight: 28 },
  headerRow: { backgroundColor: '#4f46e5' },
  dataRow: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9'
  },

  tableCell: {
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderRightWidth: 0.5,
    borderRightColor: '#e2e8f0'
  },
  headerCell: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightColor: '#818cf8'
  },
  dataCell: {
    fontSize: 8,
    color: '#2d3748',
    lineHeight: 1.3,
    textAlign: 'center'
  },

  noColumn: { width: '6%' },
  namaTugasColumn: { width: '34%', textAlign: 'left', paddingLeft: 8 },
  prokerColumn: { width: '25%', textAlign: 'left', paddingLeft: 8 },
  statusColumn: { width: '15%' },
  batasWaktuColumn: { width: '20%', borderRightWidth: 0 },

  footer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: { fontSize: 9, color: '#1a365d', fontWeight: 'bold' },
  footerDate: { fontSize: 8, color: '#718096' },

  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  noDataText: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 8,
    fontWeight: 'bold'
  },
  noDataSubText: { fontSize: 10, color: '#718096' }
})
