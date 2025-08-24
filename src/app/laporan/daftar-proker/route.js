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

// Function to format date
const formatDate = date => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Component for page header
const PageHeader = ({ orgName, pageNumber, totalPages }) => (
  <View style={styles.headerSection}>
    <Text style={styles.title}>
      DAFTAR PROGRAM KERJA {new Date().getFullYear()}
    </Text>
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

// Component for table header
const TableHeader = () => (
  <View style={[styles.tableRow, styles.headerRow]}>
    <Text style={[styles.tableCell, styles.headerCell, styles.noColumn]}>
      NO
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.namaColumn]}>
      NAMA PROGRAM
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.ketuaColumn]}>
      KETUA PELAKSANA
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.deskripsiColumn]}>
      DESKRIPSI
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.tanggalColumn]}>
      TANGGAL
    </Text>
  </View>
)

// Component for page footer
const PageFooter = ({ totalProker, currentPageStart, currentPageEnd }) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>
      Menampilkan {currentPageStart}-{currentPageEnd} dari {totalProker} program
      kerja
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

export async function GET(_req, _res) {
  try {
    const { userId, orgId, redirectToSignIn } = await auth()

    // Check authentication
    if (!userId || !orgId) {
      return redirectToSignIn()
    }

    // Get organization details
    const organization = await clerk.organizations.getOrganization({
      organizationId: orgId
    })

    // Fetch all program kerja from database
    const listProgramKerja = await prisma.proker.findMany({
      where: {
        org_id: orgId
      },
      orderBy: {
        start: 'asc'
      }
    })

    // Transform Prisma data to PDF format
    const prokerData = listProgramKerja.map((proker, index) => ({
      no: index + 1,
      nama: proker.title,
      ketua: proker.author || '-',
      deskripsi: proker.description,
      tanggal: (() => {
        if (proker.start && proker.end) {
          const start = formatDate(proker.start)
          const end = formatDate(proker.end)
          return start === end ? start : `${start} - ${end}`
        } else if (proker.start) {
          return formatDate(proker.start)
        } else if (proker.end) {
          return formatDate(proker.start)
        }
        return '-'
      })(),
      status: proker.status || 'Belum Terjadwal'
    }))

    // Set items per page (20 for program kerja since it has more columns)
    const itemsPerPage = 20 // Reduced for better readability with 5 columns
    const dataChunks = chunkArray(prokerData, itemsPerPage)
    const totalPages = dataChunks.length

    // If no program kerja found
    if (prokerData.length === 0) {
      return NextResponse.json(
        { error: 'No program kerja found in organization' },
        { status: 404 }
      )
    }

    // Generate PDF
    const stream = await renderToStream(
      <Document>
        {dataChunks.map((pageData, pageIndex) => (
          <Page key={pageIndex} size="A4" style={styles.page}>
            {/* Page Header */}
            <PageHeader
              orgName={organization.name}
              pageNumber={pageIndex + 1}
              totalPages={totalPages}
            />

            {/* Table Container */}
            <View style={styles.tableContainer}>
              {/* Table Header - repeat on each page */}
              <TableHeader />

              {/* Table Data for current page */}
              {pageData.map((proker, index) => {
                const globalIndex = pageIndex * itemsPerPage + index + 1
                return (
                  <View
                    key={`${pageIndex}-${index}`}
                    style={[styles.tableRow, styles.dataRow]}
                  >
                    <Text
                      style={[
                        styles.tableCell,
                        styles.dataCell,
                        styles.noColumn
                      ]}
                    >
                      {globalIndex}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.dataCell,
                        styles.namaColumn
                      ]}
                    >
                      {proker.nama}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.dataCell,
                        styles.ketuaColumn
                      ]}
                    >
                      {proker.ketua}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.dataCell,
                        styles.deskripsiColumn
                      ]}
                    >
                      {proker.deskripsi}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.dataCell,
                        styles.tanggalColumn
                      ]}
                    >
                      {proker.tanggal}
                    </Text>
                  </View>
                )
              })}
            </View>

            {/* Page Footer */}
            <PageFooter
              totalProker={prokerData.length}
              currentPageStart={pageIndex * itemsPerPage + 1}
              currentPageEnd={Math.min(
                (pageIndex + 1) * itemsPerPage,
                prokerData.length
              )}
            />
          </Page>
        ))}
      </Document>
    )

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="daftar-program-kerja-${organization.slug || 'organisasi'}-${new Date().getFullYear()}.pdf"`
      }
    })
  } catch (error) {
    console.error('Error generating PDF:', error)

    // Return error response
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

const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },

  // Header Styles
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

  // Table Container
  tableContainer: {
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    flex: 1
  },

  // Table Row
  tableRow: {
    flexDirection: 'row',
    minHeight: 24 // Increased for better readability
  },

  // Header Row
  headerRow: {
    backgroundColor: '#6366f1',
    minHeight: 28
  },

  // Data Row
  dataRow: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.25,
    borderBottomColor: '#f7fafc'
  },

  // Table Cell Base
  tableCell: {
    padding: 4,
    justifyContent: 'center',
    borderRightWidth: 0.25,
    borderRightColor: '#e2e8f0'
  },

  // Header Cell
  headerCell: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightColor: '#8b5cf6',
    padding: 5
  },

  // Data Cell
  dataCell: {
    fontSize: 7,
    color: '#2d3748',
    lineHeight: 1.2
  },

  // Column Widths - optimized for landscape A4
  noColumn: {
    width: '5%',
    textAlign: 'center'
  },
  namaColumn: {
    width: '25%',
    textAlign: 'left',
    paddingLeft: 6
  },
  ketuaColumn: {
    width: '18%',
    textAlign: 'left',
    paddingLeft: 6
  },
  deskripsiColumn: {
    width: '32%',
    textAlign: 'left',
    paddingLeft: 6
  },
  tanggalColumn: {
    width: '20%',
    textAlign: 'center',
    borderRightWidth: 0
  },

  // Footer
  footer: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 8,
    color: '#4a5568',
    fontWeight: 'bold'
  },
  footerDate: {
    fontSize: 7,
    color: '#718096'
  }
})
