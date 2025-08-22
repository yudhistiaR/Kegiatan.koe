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
  const parsedAmount = parseFloat(amount) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(parsedAmount)
}

// Function to group and flatten RAB items by Proker
const groupRabByProker = (prokerData, selectedProker = 'all') => {
  const grouped = {}

  prokerData.forEach(proker => {
    if (selectedProker !== 'all' && proker.title !== selectedProker) {
      return
    }

    // Flatten listRab items and add proker details
    const allRabItems = (proker.rab || []).flatMap(rabGroup => {
      return (rabGroup.listRab || []).map(item => ({
        ...item,
        prokerTitle: proker.title,
        prokerAuthor: proker.ketua_pelaksana?.fullName,
        prokerId: proker.id
      }))
    })

    if (allRabItems.length > 0) {
      if (!grouped[proker.title]) {
        grouped[proker.title] = {
          items: [],
          proker: {
            id: proker.id,
            title: proker.title,
            author: proker.ketua_pelaksana?.fullName,
            description: proker.description,
            start: proker.start,
            end: proker.end
          }
        }
      }
      grouped[proker.title].items.push(...allRabItems)
    }
  })
  return grouped
}

// Function to calculate total per proker
const calculateProkerTotal = prokerData => {
  return prokerData.items.reduce((total, item) => {
    const harga = parseFloat(item.harga) || 0
    const jumlah = parseFloat(item.jumlah) || 0
    return total + harga * jumlah
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

// Component for proker details header
const ProkerHeader = ({ proker }) => (
  <View style={styles.prokerSection}>
    <Text style={styles.prokerTitle}>{proker.title}</Text>
    <Text style={styles.prokerAuthor}>PJ: {proker.author}</Text>
    <Text style={styles.prokerDescription} numberOfLines={2}>
      {proker.description}
    </Text>
    <Text style={styles.prokerDate}>
      {formatDate(proker.start)} - {formatDate(proker.end)}
    </Text>
  </View>
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
    const { userId, orgId } = await auth()
    const { searchParams } = new URL(req.url)
    const selectedProker = searchParams.get('proker') || 'all'

    // Perbaikan: Lakukan pemeriksaan userId dan orgId secara terpisah

    if (!orgId) {
      // Perbaikan: Jika orgId kosong, kembalikan error yang lebih spesifik
      return NextResponse.json(
        { error: 'Organisasi tidak ditemukan' },
        { status: 404 }
      )
    }

    const organization = await clerk.organizations.getOrganization({
      organizationId: orgId
    })

    // Fetch data with all necessary includes
    const prokerData = await prisma.proker.findMany({
      where: { orgId: orgId },
      include: {
        ketua_pelaksana: true,
        rab: {
          include: {
            listRab: true
          }
        }
      }
    })

    const groupedRab = groupRabByProker(prokerData, selectedProker)

    if (Object.keys(groupedRab).length === 0) {
      return NextResponse.json(
        { error: 'No data found for the selected filter' },
        { status: 404 }
      )
    }

    const grandTotal = Object.values(groupedRab).reduce((total, prokerData) => {
      return total + calculateProkerTotal(prokerData)
    }, 0)

    const pages = []
    let globalPageNumber = 1

    Object.entries(groupedRab).forEach(([prokerTitle, prokerData]) => {
      const prokerTotal = calculateProkerTotal(prokerData)
      const rabItems = prokerData.items
      const prokerDetails = prokerData.proker

      const itemsPerPage = 20
      const chunks = []
      for (let i = 0; i < rabItems.length; i += itemsPerPage) {
        chunks.push(rabItems.slice(i, i + itemsPerPage))
      }

      chunks.forEach((chunk, chunkIndex) => {
        const isLastChunk = chunkIndex === chunks.length - 1
        pages.push({
          prokerTitle,
          prokerTotal,
          prokerDetails,
          items: chunk,
          isFirstPageOfProker: chunkIndex === 0,
          isLastPageOfProker: isLastChunk,
          pageNumber: globalPageNumber++,
          startIndex: chunkIndex * itemsPerPage + 1,
          totalItems: rabItems.length
        })
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

            {pageData.isFirstPageOfProker && (
              <ProkerHeader proker={pageData.prokerDetails} />
            )}

            <View style={styles.tableContainer}>
              <RabTableHeader />
              {pageData.items.map((rabItem, index) => {
                const itemNumber = pageData.startIndex + index
                const totalHarga =
                  parseFloat(rabItem.harga) * parseFloat(rabItem.jumlah)

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

              {pageData.isLastPageOfProker && (
                <View style={[styles.tableRow, styles.totalRow]}>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.totalCell,
                      styles.noColumn
                    ]}
                  ></Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.totalCell,
                      styles.namaItemColumn,
                      styles.prokerTotalLabel
                    ]}
                  >
                    TOTAL {pageData.prokerTitle.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.totalCell,
                      styles.jumlahColumn
                    ]}
                  ></Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.totalCell,
                      styles.satuanColumn
                    ]}
                  ></Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.totalCell,
                      styles.hargaColumn,
                      styles.prokerTotalInfo
                    ]}
                  >
                    {pageData.totalItems} item
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.totalCell,
                      styles.totalColumn,
                      styles.prokerTotalAmount
                    ]}
                  >
                    {formatCurrency(pageData.prokerTotal)}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ flex: 1 }} />
            <PageFooter grandTotal={grandTotal} filterInfo={selectedProker} />
          </Page>
        ))}
      </Document>
    )

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
  page: { padding: 15, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  headerSection: { marginBottom: 12, alignItems: 'center' },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 4,
    letterSpacing: 1
  },
  subtitle: { fontSize: 10, color: '#4a5568', marginBottom: 2 },
  pageInfo: { marginTop: 6, marginBottom: 3 },
  pageNumber: { fontSize: 9, color: '#718096', fontStyle: 'italic' },
  divider: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#e2e8f0',
    marginTop: 6
  },
  prokerSection: {
    backgroundColor: '#fefefe',
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#e2e8f0'
  },
  prokerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2
  },
  prokerAuthor: {
    fontSize: 9,
    color: '#6366f1',
    fontStyle: 'italic',
    marginBottom: 2
  },
  prokerDescription: {
    fontSize: 8,
    color: '#64748b',
    lineHeight: 1.3,
    marginBottom: 2
  },
  prokerDate: { fontSize: 7, color: '#94a3b8', textAlign: 'right' },
  tableContainer: {
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    flex: 1
  },
  tableRow: { flexDirection: 'row', minHeight: 24 },
  headerRow: { backgroundColor: '#6366f1', minHeight: 28 },
  dataRow: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.25,
    borderBottomColor: '#f7fafc'
  },
  tableCell: {
    padding: 4,
    justifyContent: 'center',
    borderRightWidth: 0.25,
    borderRightColor: '#e2e8f0'
  },
  headerCell: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightColor: '#8b5cf6',
    padding: 5
  },
  dataCell: { fontSize: 7, color: '#2d3748', lineHeight: 1.2 },
  noColumn: { width: '6%', textAlign: 'center' },
  namaItemColumn: { width: '30%', textAlign: 'left', paddingLeft: 6 },
  jumlahColumn: { width: '10%', textAlign: 'center' },
  satuanColumn: { width: '10%', textAlign: 'center' },
  hargaColumn: { width: '22%', textAlign: 'right', paddingRight: 6 },
  totalColumn: {
    width: '22%',
    textAlign: 'right',
    paddingRight: 6,
    borderRightWidth: 0
  },
  totalRow: {
    backgroundColor: '#f1f5f9',
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    minHeight: 32
  },
  totalCell: { fontSize: 8, fontWeight: 'bold', color: '#1e293b' },
  prokerTotalLabel: { color: '#6366f1', textAlign: 'left' },
  prokerTotalInfo: { color: '#64748b', textAlign: 'right' },
  prokerTotalAmount: {
    color: '#059669',
    textAlign: 'right',
    backgroundColor: '#ecfdf5',
    borderRadius: 2
  },
  footer: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: { fontSize: 9, color: '#1a365d', fontWeight: 'bold' },
  footerDate: { fontSize: 7, color: '#718096' }
})
