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

// Component for page header
const PageHeader = ({ orgName, pageNumber, totalPages }) => (
  <View style={styles.headerSection}>
    <Text style={styles.title}>DAFTAR ANGGOTA</Text>
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
    <Text style={[styles.tableCell, styles.headerCell, styles.emailColumn]}>
      EMAIL
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.namaColumn]}>
      NAMA LENGKAP
    </Text>
  </View>
)

// Component for page footer
const PageFooter = ({ totalMembers, currentPageStart, currentPageEnd }) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>
      Menampilkan {currentPageStart}-{currentPageEnd} dari {totalMembers}{' '}
      anggota
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

export async function GET() {
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

    // Get organization members with pagination support
    let allMembers = []
    let offset = 0
    const limit = 100
    let hasMore = true

    // Fetch all members (handle pagination)
    while (hasMore) {
      try {
        const { data, totalCount } =
          await clerk.organizations.getOrganizationMembershipList({
            organizationId: orgId,
            limit: limit,
            offset: offset
          })

        if (data && data.length > 0) {
          allMembers = [...allMembers, ...data]
          offset += limit
          hasMore = data.length === limit && allMembers.length < totalCount
        } else {
          hasMore = false
        }
      } catch (error) {
        console.error('Error fetching members:', error)
        hasMore = false
      }
    }

    // Transform Clerk data to PDF format
    const membersData = allMembers.map((membership, index) => ({
      no: index + 1,
      email:
        membership.publicUserData?.identifier ||
        membership.publicUserData?.emailAddress ||
        'N/A',
      nama: (() => {
        const firstName = membership.publicUserData?.firstName || ''
        const lastName = membership.publicUserData?.lastName || ''
        const fullName = `${firstName} ${lastName}`.trim()

        // If no name available, use email or identifier
        if (!fullName) {
          return (
            membership.publicUserData?.identifier ||
            membership.publicUserData?.emailAddress ||
            'User'
          )
        }

        return fullName
      })(),
      role: membership.role || 'member'
    }))

    // Set items per page (100 as requested)
    const itemsPerPage = 100
    const dataChunks = chunkArray(membersData, itemsPerPage)
    const totalPages = dataChunks.length

    // If no members found
    if (membersData.length === 0) {
      return NextResponse.json(
        { error: 'No members found in organization' },
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
              {pageData.map((member, index) => {
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
                        styles.emailColumn
                      ]}
                    >
                      {member.email}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.dataCell,
                        styles.namaColumn
                      ]}
                    >
                      {member.nama}
                    </Text>
                  </View>
                )
              })}
            </View>

            {/* Page Footer */}
            <PageFooter
              totalMembers={membersData.length}
              currentPageStart={pageIndex * itemsPerPage + 1}
              currentPageEnd={Math.min(
                (pageIndex + 1) * itemsPerPage,
                membersData.length
              )}
            />
          </Page>
        ))}
      </Document>
    )

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="daftar-anggota-${organization.slug || 'organisasi'}.pdf"`
      }
    })
  } catch (error) {
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
    padding: 20,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },

  // Header Styles
  headerSection: {
    marginBottom: 15,
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
    marginTop: 8,
    marginBottom: 4
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
    marginTop: 8
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
    minHeight: 18 // Sangat kompak untuk 100 data per halaman
  },

  // Header Row
  headerRow: {
    backgroundColor: '#6366f1',
    minHeight: 22 // Sedikit lebih tinggi untuk header
  },

  // Data Row
  dataRow: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.25,
    borderBottomColor: '#f7fafc'
  },

  // Table Cell Base
  tableCell: {
    padding: 3, // Padding minimal untuk muat 100 data
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
    padding: 4
  },

  // Data Cell
  dataCell: {
    fontSize: 7, // Font size sangat kecil untuk muat 100 data
    color: '#2d3748',
    lineHeight: 1.1
  },

  // Column Widths - disesuaikan untuk layout kompak
  noColumn: {
    width: '8%',
    textAlign: 'center'
  },
  emailColumn: {
    width: '40%',
    textAlign: 'left',
    paddingLeft: 6
  },
  namaColumn: {
    width: '52%',
    textAlign: 'left',
    paddingLeft: 8,
    borderRightWidth: 0
  },

  // Footer
  footer: {
    marginTop: 10,
    paddingTop: 8,
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
