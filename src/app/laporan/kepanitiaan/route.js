// /api/v1/laporan/struktur-kepanitiaan/pdf/route.js

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

// Component for page header
const PageHeader = ({ orgName, pageNumber, totalPages, filterInfo }) => (
  <View style={styles.headerSection}>
    <Text style={styles.title}>LAPORAN STRUKTUR KEPANITIAAN</Text>
    <Text style={styles.subtitle}>
      {orgName?.toUpperCase() || 'ORGANISASI'}
    </Text>
    {filterInfo && (
      <Text style={styles.filterInfo}>Program Kerja: {filterInfo}</Text>
    )}
    <View style={styles.pageInfo}>
      <Text style={styles.pageNumber}>
        Halaman {pageNumber} dari {totalPages}
      </Text>
    </View>
    <View style={styles.divider} />
  </View>
)

// Component for table header
const StrukturTableHeader = () => (
  <View style={[styles.tableRow, styles.headerRow]}>
    <Text style={[styles.tableCell, styles.headerCell, styles.noColumn]}>
      NO
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.namaColumn]}>
      NAMA ANGGOTA
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.jabatanColumn]}>
      JABATAN
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.divisiColumn]}>
      DIVISI
    </Text>
    <Text style={[styles.tableCell, styles.headerCell, styles.kontakColumn]}>
      KONTAK
    </Text>
  </View>
)

// Component for page footer
const PageFooter = ({ totalProker, totalAnggota }) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>
      Total Program Kerja: {totalProker} | Total Anggota: {totalAnggota}
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
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const prokerId = searchParams.get('prokerId') || 'all'

    const organization = await clerk.organizations.getOrganization({
      organizationId: orgId
    })

    // Menggunakan logika Prisma yang Anda berikan
    const prokerData = await prisma.proker.findMany({
      where: {
        orgId: orgId,
        ...(prokerId !== 'all' && { id: prokerId })
      },
      select: {
        id: true,
        title: true,
        divisi: {
          select: {
            id: true,
            name: true,
            anggota: {
              select: {
                jenis_jabatan: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    telpon: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { title: 'asc' }
    })

    if (prokerData.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada data kepanitiaan ditemukan' },
        { status: 404 }
      )
    }

    const filterInfo = prokerId !== 'all' ? prokerData[0]?.title : null
    let totalAnggota = 0

    // Pagination logic
    const itemsPerPage = 15
    const pages = []
    let globalPageNumber = 1

    prokerData.forEach(proker => {
      const allMembersForProker = proker.divisi.flatMap(divisi =>
        divisi.anggota.map(anggota => {
          totalAnggota++
          return {
            divisiName: divisi.name,
            name: `${anggota.user.firstName || ''} ${anggota.user.lastName || ''}`.trim(),
            jabatan: anggota.jenis_jabatan,
            kontak: anggota.user.telpon || anggota.user.email || '-'
          }
        })
      )

      const memberChunks = chunkArray(allMembersForProker, itemsPerPage)

      if (allMembersForProker.length > 0) {
        memberChunks.forEach((chunk, chunkIndex) => {
          pages.push({
            prokerTitle: proker.title,
            members: chunk,
            isFirstPageOfProker: chunkIndex === 0,
            pageNumber: globalPageNumber++,
            startIndex: chunkIndex * itemsPerPage + 1
          })
        })
      } else {
        pages.push({
          prokerTitle: proker.title,
          members: [],
          isFirstPageOfProker: true,
          pageNumber: globalPageNumber++,
          startIndex: 1
        })
      }
    })

    const totalPages = pages.length

    const stream = await renderToStream(
      <Document>
        {pages.map((page, pageIndex) => (
          <Page
            key={pageIndex}
            size="A4"
            orientation="landscape"
            style={styles.page}
          >
            <PageHeader
              orgName={organization.name}
              pageNumber={page.pageNumber}
              totalPages={totalPages}
              filterInfo={filterInfo}
            />

            <View style={styles.prokerSection}>
              <Text style={styles.prokerTitle}>
                Program Kerja: {page.prokerTitle}
              </Text>
            </View>

            <View style={styles.tableContainer}>
              <StrukturTableHeader />
              {page.members.map((member, memberIndex) => (
                <View
                  key={memberIndex}
                  style={[styles.tableRow, styles.dataRow]}
                >
                  <Text
                    style={[styles.tableCell, styles.dataCell, styles.noColumn]}
                  >
                    {page.startIndex + memberIndex}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.dataCell,
                      styles.namaColumn
                    ]}
                  >
                    {member.name}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.dataCell,
                      styles.jabatanColumn
                    ]}
                  >
                    {member.jabatan}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.dataCell,
                      styles.divisiColumn
                    ]}
                  >
                    {member.divisiName}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.dataCell,
                      styles.kontakColumn
                    ]}
                  >
                    {member.kontak}
                  </Text>
                </View>
              ))}
            </View>

            {page.members.length === 0 && (
              <Text style={styles.noDataSubText}>
                Tidak ada anggota dalam program kerja ini.
              </Text>
            )}

            <PageFooter
              totalProker={prokerData.length}
              totalAnggota={totalAnggota}
            />
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

  prokerSection: {
    backgroundColor: '#f8fafc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  prokerTitle: { fontSize: 12, fontWeight: 'bold', color: '#1e293b' },

  tableContainer: {
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#e2e8f0'
  },
  tableRow: { flexDirection: 'row', minHeight: 28 },
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
  dataCell: {
    fontSize: 8,
    color: '#2d3748',
    lineHeight: 1.3,
    textAlign: 'left',
    paddingLeft: 6
  },

  noColumn: { width: '5%', textAlign: 'center' },
  namaColumn: { width: '25%' },
  jabatanColumn: { width: '20%' },
  divisiColumn: { width: '20%' },
  kontakColumn: { width: '30%', borderRightWidth: 0 },

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
  footerDate: { fontSize: 7, color: '#718096' },
  noDataSubText: {
    fontSize: 10,
    color: '#718096',
    textAlign: 'center',
    marginTop: 20
  }
})
