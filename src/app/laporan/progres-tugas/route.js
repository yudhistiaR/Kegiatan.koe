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

// Function to group Tugas items by division
const groupTugasByDivision = tugasItems => {
  const grouped = {}

  tugasItems.forEach(tugas => {
    const divisionName = tugas.divisi?.name || 'Tidak Ada Divisi'

    if (!grouped[divisionName]) {
      grouped[divisionName] = {
        tasks: []
      }
    }
    grouped[divisionName].tasks.push(tugas)
  })

  return grouped
}

// Component for program kerja header
const ProkerHeader = ({ proker }) => (
  <View style={styles.prokerSection}>
    <Text style={styles.prokerSectionTitle}>Detail Program Kerja:</Text>
    <View style={styles.prokerDetail}>
      <View style={styles.prokerHeader}>
        <Text style={styles.prokerTitle}>{proker.title}</Text>
        <Text style={styles.prokerAuthor}>PJ: {proker.author}</Text>
      </View>
      <Text style={styles.prokerDescription}>{proker.description}</Text>
      <Text style={styles.prokerDate}>
        {formatDate(proker.start)} - {formatDate(proker.end)}
      </Text>
    </View>
  </View>
)

// Component for page header
const PageHeader = ({ orgName, pageNumber, totalPages }) => (
  <View style={styles.headerSection}>
    <Text style={styles.title}>DAFTAR TUGAS PROGRAM KERJA</Text>
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

// Component for Tugas table header
const TugasTableHeader = () => (
  <View style={[styles.tableRow, styles.headerRow]}>
    <Text style={[styles.tableCell, styles.headerCell, styles.noColumn]}>
      NO
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.namaTugasColumn]}>
      NAMA TUGAS
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.pjColumn]}>
      PENANGGUNG JAWAB
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.priorityColumn]}>
      PRIORITAS
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.statusColumn]}>
      STATUS
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.jadwalColumn]}>
      JADWAL
    </Text>
  </View>
)

// Component for page footer
const PageFooter = ({ totalTugas }) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>TOTAL TUGAS: {totalTugas}</Text>
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

const NoDataPage = ({ organization, proker }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <PageHeader orgName={organization.name} pageNumber={1} totalPages={1} />
      {proker && <ProkerHeader proker={proker} />}
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>
          Tidak ada data tugas yang ditemukan untuk program kerja ini.
        </Text>
        <Text style={styles.noDataSubText}>
          Silakan tambahkan tugas terlebih dahulu untuk dapat mencetak laporan.
        </Text>
      </View>
      <PageFooter totalTugas={0} />
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
    const prokerId = searchParams.get('prokerId')

    if (!prokerId) {
      return NextResponse.json(
        { error: 'Proker ID is required' },
        { status: 400 }
      )
    }

    const organization = await clerk.organizations.getOrganization({
      organizationId: orgId
    })

    const proker = await prisma.proker.findUnique({
      where: { id: prokerId, org_id: orgId }
    })

    if (!proker) {
      return NextResponse.json(
        { error: 'Program Kerja not found' },
        { status: 404 }
      )
    }

    const listTugas = await prisma.tugas.findMany({
      where: {
        prokerId: prokerId
      },
      orderBy: [{ status: 'asc' }, { order: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        priority: true,
        description: true,
        status: true,
        start: true,
        end: true,
        divisi: {
          select: {
            id: true,
            name: true
          }
        },
        assignedTo: {
          select: {
            user: {
              select: {
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    // --- DIUBAH: Handler untuk data kosong ---
    // Jika tidak ada tugas, buat PDF khusus "Tidak Ada Data"
    if (listTugas.length === 0) {
      const stream = await renderToStream(
        <NoDataPage organization={organization} proker={proker} />
      )

      const filename = `laporan-tugas-kosong-${proker.slug || 'proker'}.pdf`

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      })
    }

    // --- Logika untuk data yang ada (tidak berubah) ---
    const groupedTugas = groupTugasByDivision(listTugas)
    const totalTugasCount = listTugas.length
    const tasksPerPage = 20

    const pages = []
    let globalPageNumber = 1
    let globalTaskIndex = 1

    Object.entries(groupedTugas).forEach(([divisionName, divisionData]) => {
      const divisionTasks = divisionData.tasks
      const chunks = []
      for (let i = 0; i < divisionTasks.length; i += tasksPerPage) {
        chunks.push(divisionTasks.slice(i, i + tasksPerPage))
      }

      chunks.forEach((chunk, chunkIndex) => {
        pages.push({
          divisionName,
          tasks: chunk,
          isFirstPageOfDivision: chunkIndex === 0,
          pageNumber: globalPageNumber++,
          startIndex: globalTaskIndex
        })
        globalTaskIndex += chunk.length
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
            />

            {pageIndex === 0 && <ProkerHeader proker={proker} />}

            {pageData.isFirstPageOfDivision && (
              <View style={styles.divisionSection}>
                <Text style={styles.divisionName}>
                  DIVISI: {pageData.divisionName.toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.tableContainer}>
              <TugasTableHeader />
              {pageData.tasks.map((tugas, index) => {
                const itemNumber = pageData.startIndex + index
                const assignedUser = tugas.assignedTo?.user
                const penanggungJawab = assignedUser
                  ? `${assignedUser.firstName || ''} ${
                      assignedUser.lastName || ''
                    }`.trim() || assignedUser.username
                  : '-'

                return (
                  <View
                    key={tugas.id}
                    style={[styles.tableRow, styles.dataRow]}
                  >
                    <Text
                      style={[
                        styles.tableCell,
                        styles.dataCell,
                        styles.noColumn
                      ]}
                    >
                      {itemNumber}
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
                        styles.pjColumn
                      ]}
                    >
                      {penanggungJawab}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.dataCell,
                        styles.priorityColumn
                      ]}
                    >
                      {tugas.priority}
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
                        styles.jadwalColumn
                      ]}
                    >
                      {`${formatDate(tugas.start)} - ${formatDate(tugas.end)}`}
                    </Text>
                  </View>
                )
              })}
            </View>

            <PageFooter totalTugas={totalTugasCount} />
          </Page>
        ))}
      </Document>
    )

    const filename = `daftar-tugas-${proker.slug || 'proker'}-${
      organization.slug || 'organisasi'
    }.pdf`

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// --- GANTI SELURUH StyleSheet DENGAN INI ---
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  headerSection: {
    marginBottom: 12,
    alignItems: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 4,
    letterSpacing: 1
  },
  subtitle: {
    fontSize: 10,
    color: '#4a5568',
    marginBottom: 2
  },
  pageInfo: {
    marginTop: 6,
    marginBottom: 3
  },
  pageNumber: {
    fontSize: 9,
    color: '#718096',
    fontStyle: 'italic'
  },
  divider: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#e2e8f0',
    marginTop: 6
  },
  prokerSection: {
    backgroundColor: '#f8fafc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  prokerSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 6
  },
  prokerDetail: {},
  prokerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  prokerTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  prokerAuthor: {
    fontSize: 9,
    color: '#6366f1',
    fontStyle: 'italic'
  },
  prokerDescription: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 1.4,
    marginBottom: 4
  },
  prokerDate: {
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'right'
  },
  divisionSection: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 8,
    borderRadius: 3
  },
  divisionName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#475569'
  },
  tableContainer: {
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    flex: 1
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 28
  },
  headerRow: {
    backgroundColor: '#6366f1'
  },
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
    borderRightColor: '#8b5cf6'
  },
  dataCell: {
    fontSize: 8,
    color: '#2d3748',
    lineHeight: 1.3,
    textAlign: 'center',
    alignContent: 'center'
  },
  noColumn: { width: '5%' },
  namaTugasColumn: { width: '30%', textAlign: 'left', paddingLeft: 8 },
  pjColumn: { width: '20%', textAlign: 'left', paddingLeft: 8 },
  priorityColumn: { width: '10%' },
  statusColumn: { width: '12%' },
  jadwalColumn: { width: '23%', borderRightWidth: 0 },
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
  footerText: {
    fontSize: 10,
    color: '#1a365d',
    fontWeight: 'bold'
  },
  footerDate: {
    fontSize: 8,
    color: '#718096'
  },
  // --- BARU: Styles untuk halaman "Tidak Ada Data" ---
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
  noDataSubText: {
    fontSize: 10,
    color: '#718096'
  }
})
