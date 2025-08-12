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

// Function to format currency
const formatCurrency = amount => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

// Function to group RAB items by division with proker details and filter
const groupRabByDivision = (rabItems, selectedProker = 'all') => {
  const grouped = {}

  rabItems.forEach(proker => {
    // Skip proker if filter is applied and doesn't match
    if (selectedProker !== 'all' && proker.title !== selectedProker) {
      return
    }

    proker.rab.forEach(rabItem => {
      const divisionName = rabItem.divisi?.name || 'Tidak Ada Divisi'

      if (!grouped[divisionName]) {
        grouped[divisionName] = {
          items: [],
          prokers: new Map()
        }
      }

      // Store unique prokers for this division
      if (!grouped[divisionName].prokers.has(proker.id)) {
        grouped[divisionName].prokers.set(proker.id, {
          id: proker.id,
          title: proker.title,
          author: proker.author,
          description: proker.description,
          start: proker.start,
          end: proker.end
        })
      }

      grouped[divisionName].items.push({
        ...rabItem,
        prokerTitle: proker.title,
        prokerAuthor: proker.author,
        prokerId: proker.id
      })
    })
  })

  // Convert prokers Map to Array for easier handling
  Object.keys(grouped).forEach(division => {
    grouped[division].prokers = Array.from(grouped[division].prokers.values())
  })

  return grouped
}

// Function to calculate total per division
const calculateDivisionTotal = divisionData => {
  return divisionData.items.reduce((total, item) => {
    return total + item.harga * item.jumlah
  }, 0)
}

// Component for page header
const PageHeader = ({ orgName, pageNumber, totalPages }) => (
  <View style={styles.headerSection}>
    <Text style={styles.title}>RAB PROGRAM KERJA</Text>
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

// Component for division header with proker details
const DivisionHeader = ({ prokers }) => (
  <>
    {/* Program Kerja Details */}
    <View style={styles.prokerSection}>
      <Text style={styles.prokerSectionTitle}>Program Kerja:</Text>
      {prokers.map((proker, _index) => (
        <View key={proker.id} style={styles.prokerDetail}>
          <View style={styles.prokerHeader}>
            <Text style={styles.prokerTitle}>{proker.title}</Text>
            <Text style={styles.prokerAuthor}>PJ: {proker.author}</Text>
          </View>
          <Text style={styles.prokerDescription} numberOfLines={2}>
            {proker.description}
          </Text>
          <Text style={styles.prokerDate}>
            {formatDate(proker.start)} - {formatDate(proker.end)}
          </Text>
        </View>
      ))}
    </View>
  </>
)

// Component for RAB table header
const RabTableHeader = () => (
  <View style={[styles.tableRow, styles.headerRow]}>
    <Text style={[styles.tableCell, styles.headerCell, styles.noColumn]}>
      NO
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.namaItemColumn]}>
      NAMA ITEM
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.prokerColumn]}>
      PROGRAM KERJA
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.jumlahColumn]}>
      JUMLAH
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.satuanColumn]}>
      SATUAN
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.hargaColumn]}>
      HARGA SATUAN
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.totalColumn]}>
      TOTAL
    </Text>
  </View>
)

// Component for page footer
const PageFooter = ({ grandTotal, filterInfo }) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>
      GRAND TOTAL{filterInfo && filterInfo !== 'all' ? ` (${filterInfo})` : ''}:{' '}
      {formatCurrency(grandTotal)}
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

export async function GET(req) {
  try {
    const { userId, orgId, redirectToSignIn } = await auth()
    const { searchParams } = new URL(req.url)
    const selectedProker = searchParams.get('proker') || 'all'

    // Check authentication
    if (!userId || !orgId) {
      return redirectToSignIn()
    }

    // Get organization details
    const organization = await clerk.organizations.getOrganization({
      organizationId: orgId
    })

    // Fixed Prisma query with conditional filtering
    let whereClause = { org_id: orgId }

    // Add proker filter if specified
    if (selectedProker !== 'all') {
      whereClause.title = selectedProker
    }

    const rabItems = await prisma.proker.findMany({
      where: whereClause,
      include: {
        rab: {
          include: {
            divisi: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    console.dir(rabItems, { depth: Infinity })

    // Group RAB by division with filter
    const groupedRab = groupRabByDivision(rabItems, selectedProker)

    // Check if no data after filtering
    if (Object.keys(groupedRab).length === 0) {
      return NextResponse.json(
        { error: 'No data found for the selected filter' },
        { status: 404 }
      )
    }

    // Calculate grand total
    const grandTotal = Object.values(groupedRab).reduce(
      (total, divisionData) => {
        return total + calculateDivisionTotal(divisionData)
      },
      0
    )

    // Items per page for each division
    const itemsPerPage = 15

    // Generate pages for each division
    const pages = []
    let globalPageNumber = 1

    Object.entries(groupedRab).forEach(([divisionName, divisionData]) => {
      const divisionTotal = calculateDivisionTotal(divisionData)
      const rabItems = divisionData.items
      const prokers = divisionData.prokers

      // Split division items into pages
      const chunks = []
      for (let i = 0; i < rabItems.length; i += itemsPerPage) {
        chunks.push(rabItems.slice(i, i + itemsPerPage))
      }

      chunks.forEach((chunk, chunkIndex) => {
        const isLastChunk = chunkIndex === chunks.length - 1
        pages.push({
          divisionName,
          divisionTotal,
          prokers,
          items: chunk,
          isFirstPageOfDivision: chunkIndex === 0,
          isLastPageOfDivision: isLastChunk,
          pageNumber: globalPageNumber++,
          startIndex: chunkIndex * itemsPerPage + 1,
          totalItems: rabItems.length
        })
      })
    })

    const totalPages = pages.length

    // Generate PDF
    const stream = await renderToStream(
      <Document>
        {pages.map((pageData, pageIndex) => (
          <Page key={pageIndex} size="A4" style={styles.page}>
            {/* Page Header */}
            <PageHeader
              orgName={organization.name}
              pageNumber={pageData.pageNumber}
              totalPages={totalPages}
              divisionName={pageData.divisionName}
              filterInfo={selectedProker}
            />

            {/* Division Header with Proker Details - only on first page of each division */}
            {pageData.isFirstPageOfDivision && (
              <DivisionHeader
                divisionName={pageData.divisionName}
                prokers={pageData.prokers}
              />
            )}

            {/* Table Container */}
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <RabTableHeader />

              {/* Table Data for current page */}
              {pageData.items.map((rabItem, index) => {
                const itemNumber = pageData.startIndex + index
                const totalHarga = rabItem.harga * rabItem.jumlah

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
                      {itemNumber}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.dataCell,
                        styles.namaItemColumn
                      ]}
                    >
                      {rabItem.nama}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.dataCell,
                        styles.prokerColumn
                      ]}
                    >
                      {rabItem.prokerTitle}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.dataCell,
                        styles.jumlahColumn
                      ]}
                    >
                      {rabItem.jumlah}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.dataCell,
                        styles.satuanColumn
                      ]}
                    >
                      {rabItem.satuan}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.dataCell,
                        styles.hargaColumn
                      ]}
                    >
                      {formatCurrency(rabItem.harga)}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.dataCell,
                        styles.totalColumn
                      ]}
                    >
                      {formatCurrency(totalHarga)}
                    </Text>
                  </View>
                )
              })}

              {/* Division Total Row - only on last page of each division */}
              {pageData.isLastPageOfDivision && (
                <View style={[styles.tableRow, styles.totalRow]}>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.totalCell,
                      styles.noColumn
                    ]}
                  >
                    {/* Empty */}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.totalCell,
                      styles.namaItemColumn,
                      styles.divisionTotalLabel
                    ]}
                  >
                    {pageData.divisionName.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.totalCell,
                      styles.prokerColumn
                    ]}
                  >
                    {/* Empty */}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.totalCell,
                      styles.jumlahColumn
                    ]}
                  >
                    {/* Empty */}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.totalCell,
                      styles.satuanColumn
                    ]}
                  >
                    {/* Empty */}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.totalCell,
                      styles.hargaColumn,
                      styles.divisionTotalInfo
                    ]}
                  >
                    {pageData.totalItems} item
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.totalCell,
                      styles.totalColumn,
                      styles.divisionTotalAmount
                    ]}
                  >
                    {formatCurrency(pageData.divisionTotal)}
                  </Text>
                </View>
              )}
            </View>

            {/* Page Footer */}
            <PageFooter grandTotal={grandTotal} filterInfo={selectedProker} />
          </Page>
        ))}
      </Document>
    )

    // Generate filename based on filter
    const filterSuffix =
      selectedProker !== 'all'
        ? `-${selectedProker.toLowerCase().replace(/\s+/g, '-')}`
        : ''
    const filename = `rab-program-kerja${filterSuffix}-${organization.slug || 'organisasi'}-${new Date().getFullYear()}.pdf`

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
  filterInfo: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 2,
    backgroundColor: '#fef2f2',
    padding: 4,
    borderRadius: 2
  },
  divisionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4
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

  // Division Section
  divisionSection: {
    backgroundColor: '#f8fafc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1'
  },
  divisionName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a365d'
  },

  // Program Kerja Section
  prokerSection: {
    backgroundColor: '#fefefe',
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#e2e8f0'
  },
  prokerSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 6
  },
  prokerDetail: {
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9'
  },
  prokerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3
  },
  prokerTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1
  },
  prokerAuthor: {
    fontSize: 8,
    color: '#6366f1',
    fontStyle: 'italic'
  },
  prokerDescription: {
    fontSize: 8,
    color: '#64748b',
    lineHeight: 1.3,
    marginBottom: 2
  },
  prokerDate: {
    fontSize: 7,
    color: '#94a3b8',
    textAlign: 'right'
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
    minHeight: 24
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

  // Column Widths - optimized for RAB data
  noColumn: {
    width: '6%',
    textAlign: 'center'
  },
  namaItemColumn: {
    width: '22%',
    textAlign: 'left',
    paddingLeft: 6
  },
  prokerColumn: {
    width: '20%',
    textAlign: 'left',
    paddingLeft: 6
  },
  jumlahColumn: {
    width: '8%',
    textAlign: 'center'
  },
  satuanColumn: {
    width: '10%',
    textAlign: 'center'
  },
  hargaColumn: {
    width: '17%',
    textAlign: 'right',
    paddingRight: 6
  },
  totalColumn: {
    width: '17%',
    textAlign: 'right',
    paddingRight: 6,
    borderRightWidth: 0
  },

  // Total Row (Division Summary)
  totalRow: {
    backgroundColor: '#f1f5f9',
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    minHeight: 32
  },
  totalCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  divisionTotalLabel: {
    color: '#6366f1',
    textAlign: 'left'
  },
  divisionTotalInfo: {
    color: '#64748b',
    textAlign: 'right'
  },
  divisionTotalAmount: {
    color: '#059669',
    textAlign: 'right',
    backgroundColor: '#ecfdf5',
    borderRadius: 2
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
    fontSize: 9,
    color: '#1a365d',
    fontWeight: 'bold'
  },
  footerDate: {
    fontSize: 7,
    color: '#718096'
  }
})
