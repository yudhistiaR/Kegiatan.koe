import { NextResponse } from 'next/server'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToStream
} from '@react-pdf/renderer'

export async function GET() {
  const stream = await renderToStream(
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>DAFTAR ANGGOTA HMP-SI</Text>
        <View style={styles.table}>
          {/* Header Table */}
          <View style={[styles.tableRow, styles.tableHeaderCell]}>
            <Text style={[styles.tableCell, { flex: 0.1 }]}>No</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>NPM</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>NAMA</Text>
          </View>
          {/* Data Rows */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 0.1 }]}>1</Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: 'start' }]}>
              2110020054
            </Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: 'justify' }]}>
              M.Yudhistia Rahman
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/pdf'
    }
  })
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica'
  },
  header: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000'
  },
  tableRow: {
    textAlign: 'center',
    flexDirection: 'row'
  },
  tableCell: {
    padding: 5,
    fontSize: 12,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000'
  },
  tableHeaderCell: {
    fontWeight: 'bold'
  }
})
