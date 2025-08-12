'use client'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { formatDate } from '@/helpers/formatedate'
import DOMPurify from 'dompurify'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { LoadingState, ErrorState } from '../LoadState/LoadStatus'

// Dynamic import for PDF components to avoid SSR issues
let Document, Page, Text, View, StyleSheet, PDFViewer, Font

if (typeof window !== 'undefined') {
  const pdfRenderer = require('@react-pdf/renderer')
  Document = pdfRenderer.Document
  Page = pdfRenderer.Page
  Text = pdfRenderer.Text
  View = pdfRenderer.View
  StyleSheet = pdfRenderer.StyleSheet
  PDFViewer = pdfRenderer.PDFViewer
  Font = pdfRenderer.Font
}

const LaporanNotulensi = () => {
  const { orgId } = useAuth()
  const [isClient, setIsClient] = useState(false)
  const [selectedProkerId, setSelectedProkerId] = useState('')

  useEffect(() => {
    setIsClient(true)
    // Register font only on client side
    if (typeof window !== 'undefined' && Font) {
      Font.register({
        family: 'Inter',
        src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
      })
    }
  }, [])

  // Fetch proker list for filter dropdown
  const { data: prokerList, isLoading: isLoadingProker } = useQuery({
    queryKey: ['proker-list-for-notulensi-filter', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/laporan/proker/${orgId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch proker list')
      }
      return response.json()
    },
    enabled: !!orgId
  })

  // Fetch notulensi data based on selected proker
  const {
    data: notulensiData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['laporan-notulensi', orgId, selectedProkerId],
    queryFn: async () => {
      // Only fetch data if proker is selected
      const response = await fetch(
        `/api/v1/proker/${orgId}/${selectedProkerId}/notulensi`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch notulensi data for selected proker')
      }
      return response.json()
    },
    enabled: !!orgId && !!selectedProkerId // Only enable when proker is selected
  })

  const handleProkerFilterChange = value => {
    setSelectedProkerId(value)
  }

  // Get selected proker title for display
  const selectedProkerTitle = prokerList?.find(
    p => p.id === selectedProkerId
  )?.title

  // Function to strip HTML tags for PDF rendering
  const stripHtml = html => {
    if (!html) return ''
    const tmp = document.createElement('div')
    tmp.innerHTML = DOMPurify.sanitize(html)
    return tmp.textContent || tmp.innerText || ''
  }

  // Function to format time
  const formatTime = time => {
    if (!time) return '-'
    return time.substring(0, 5) // Display HH:MM
  }

  // PDF Document Component
  const NotulensiPDFDocument = ({ data }) => {
    if (!Document || !Page || !Text || !View) return null

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.content}>
            {data && data.length > 0 ? (
              data.map((meetingData, index) => (
                <View
                  key={index}
                  style={styles.meetingSection}
                  break={index > 0}
                >
                  {/* Main Section */}
                  <View style={styles.section}>
                    {/* Title with emoji */}
                    <Text style={styles.mainTitle}>
                      NOTULENSI RAPAT{' '}
                      {meetingData.title?.toUpperCase() || 'RAPAT'}
                    </Text>

                    {/* Meeting Details */}
                    <View style={styles.detailsSection}>
                      <Text style={styles.detailText}>
                        Tanggal: {formatDate(meetingData.date)}
                      </Text>
                      <Text style={styles.detailText}>
                        Waktu: {formatTime(meetingData.time)}
                      </Text>
                      <Text style={styles.detailText}>
                        Tempat: {meetingData.location || '-'}
                      </Text>
                      <Text style={styles.detailText}>
                        Peserta: {meetingData.attendees || '-'}
                      </Text>
                      {selectedProkerTitle && (
                        <Text style={styles.detailText}>
                          Program Kerja: {selectedProkerTitle}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Agenda Section */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AGENDA:</Text>
                    <Text style={styles.sectionText}>
                      {meetingData.agenda || 'Tidak ada agenda yang dicatat'}
                    </Text>
                  </View>

                  {/* Notulensi Section */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>NOTULENSI:</Text>
                    <Text style={styles.sectionText}>
                      {stripHtml(meetingData.content) ||
                        'Tidak ada notulensi yang dicatat'}
                    </Text>
                  </View>

                  {/* Footer with save date */}
                  <View style={styles.saveDate}>
                    <Text style={styles.saveDateText}>
                      Disimpan pada: {new Date().toLocaleString('id-ID')}
                    </Text>
                  </View>

                  {/* Separator between meetings */}
                  {index < data.length - 1 && (
                    <View style={styles.meetingSeparator} />
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  Tidak ada data notulensi untuk program kerja "
                  {selectedProkerTitle}".
                </Text>
              </View>
            )}
          </View>
        </Page>
      </Document>
    )
  }

  if (isLoadingProker) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Laporan Notulensi Rapat</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Preview dokumen notulensi rapat dalam format PDF
          </p>
        </div>
        {selectedProkerId && (
          <div className="text-sm text-muted-foreground">
            Total Rapat: {notulensiData?.length || 0}
          </div>
        )}
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-4 p-4 rounded-lg">
        <span className="text-sm font-medium">
          Filter berdasarkan Program Kerja:
        </span>
        <Select
          onValueChange={handleProkerFilterChange}
          value={selectedProkerId}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Pilih Program Kerja" />
          </SelectTrigger>
          <SelectContent>
            {prokerList?.map(item => (
              <SelectItem key={item.id} value={item.id}>
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedProkerId && (
          <button
            onClick={() => setSelectedProkerId('')}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* PDF Viewer - Only render when proker is selected */}
      {selectedProkerId ? (
        <div
          className="border rounded-lg overflow-hidden"
          style={{ height: '800px' }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data notulensi...</p>
              </div>
            </div>
          ) : isClient && PDFViewer ? (
            <PDFViewer
              key={Date.now()}
              style={{ width: '100%', height: '100%' }}
            >
              <NotulensiPDFDocument data={notulensiData} />
            </PDFViewer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat PDF viewer...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Pilih Program Kerja</h3>
            <p>
              Silakan pilih program kerja terlebih dahulu untuk melihat laporan
              notulensi rapat.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = StyleSheet?.create
  ? StyleSheet.create({
      page: {
        fontFamily: 'Helvetica',
        fontSize: 12,
        lineHeight: 1.6,
        padding: 40,
        backgroundColor: '#ffffff'
      },

      // Content Styles
      content: {
        flex: 1
      },

      // Meeting Section
      meetingSection: {
        marginBottom: 30
      },

      // Section Styles
      section: {
        marginBottom: 20
      },

      // Main Title (with emoji)
      mainTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a202c',
        marginBottom: 15,
        textAlign: 'left'
      },

      // Details Section
      detailsSection: {
        marginBottom: 15
      },
      detailText: {
        fontSize: 12,
        color: '#2d3748',
        marginBottom: 4,
        lineHeight: 1.4
      },

      // Section Title (AGENDA, NOTULENSI)
      sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a202c',
        marginBottom: 8
      },

      // Section Text Content
      sectionText: {
        fontSize: 12,
        color: '#2d3748',
        lineHeight: 1.5,
        textAlign: 'justify'
      },

      // Save Date
      saveDate: {
        marginTop: 20,
        marginBottom: 10
      },
      saveDateText: {
        fontSize: 10,
        color: '#718096',
        fontStyle: 'italic'
      },

      // Meeting Separator
      meetingSeparator: {
        height: 2,
        backgroundColor: '#e2e8f0',
        marginVertical: 30,
        width: '100%'
      },

      // Empty State
      emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40
      },
      emptyText: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center'
      }
    })
  : {}

export default LaporanNotulensi
