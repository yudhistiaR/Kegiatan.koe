'use client'

//Hooks
import { useParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import DOMPurify from 'dompurify'
import { useMutation, useQueryClient } from '@tanstack/react-query'

//components
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Blockquote from '@tiptap/extension-blockquote'
import HardBreak from '@tiptap/extension-hard-break'
import {
  Save,
  FileText,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const NotulensApp = () => {
  const { divisiId, prokerId } = useParams()
  const { orgId } = useAuth()

  // Refs untuk tracking changes
  const lastSavedDataRef = useRef('')
  const isInitialLoadRef = useRef(true)
  const queryClient = useQueryClient()

  // Helper function untuk format DateTime
  const formatDateTime = (date, time) => {
    try {
      // Pastikan format yang benar untuk DateTime
      const dateTimeString = `${date}T${time}:00`
      const dateTime = new Date(dateTimeString)

      // Validasi apakah date valid
      if (isNaN(dateTime.getTime())) {
        throw new Error('Invalid date')
      }

      return dateTime.toISOString()
    } catch (error) {
      console.error('Error formatting datetime:', error)
      // Fallback ke current time
      return new Date().toISOString()
    }
  }

  const [meetingData, setMeetingData] = useState({
    divisiId: divisiId,
    org_id: orgId,
    prokerId: prokerId,
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    location: '',
    attendees: '',
    agenda: '',
    content: ''
  })
  const [saveStatus, setSaveStatus] = useState('unsaved')
  const [lastSaved, setLastSaved] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const mutation = useMutation({
    mutationFn: async data => {
      const formattedData = {
        divisiId: divisiId,
        org_id: orgId,
        prokerId: prokerId,
        title: data.title,
        date: formatDateTime(data.date, data.time),
        location: data.location,
        attendees: data.attendees,
        agenda: data.agenda,
        content: data.content
      }

      const res = await fetch(`/api/v1/proker/divisi/${divisiId}/notulen`, {
        body: JSON.stringify(formattedData),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        throw new Error('Failed to save')
      }

      return res.json()
    },
    onSuccess: () => {
      setSaveStatus('saved')
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      lastSavedDataRef.current = JSON.stringify(meetingData)

      // Simpan ke localStorage setelah berhasil save ke backend
      const dataToSave = {
        ...meetingData,
        lastModified: new Date().toISOString()
      }
      localStorage.setItem(
        `notulensi_data_${divisiId}_${prokerId}`,
        JSON.stringify(dataToSave)
      )
      queryClient.invalidateQueries(['notulensi', divisiId, prokerId])

      toast.success('Data berhasil disimpan')
    },
    onError: error => {
      setSaveStatus('error')
      queryClient.invalidateQueries(['notulensi', divisiId, prokerId])
      toast.error('Gagal menyimpan data: ' + error.message)
    }
  })

  // Function untuk save manual
  const handleManualSave = useCallback(() => {
    if (!hasUnsavedChanges) {
      toast.info('Tidak ada perubahan untuk disimpan')
      return
    }

    // Validasi form
    if (!meetingData.title.trim()) {
      toast.error('Judul rapat harus diisi')
      return
    }

    setSaveStatus('saving')
    mutation.mutate(meetingData)
  }, [meetingData, hasUnsavedChanges, mutation])

  // Function untuk save ke localStorage saja (untuk persist saat refresh)
  const saveToLocalStorage = useCallback(
    data => {
      const dataToSave = {
        ...data,
        lastModified: new Date().toISOString()
      }
      localStorage.setItem(
        `notulensi_data_${divisiId}_${prokerId}`,
        JSON.stringify(dataToSave)
      )
    },
    [divisiId, prokerId]
  )

  // Function untuk detect changes
  const detectChanges = useCallback(
    newData => {
      if (isInitialLoadRef.current) {
        return
      }

      const currentDataString = JSON.stringify(newData)
      const hasChanges = currentDataString !== lastSavedDataRef.current

      if (hasChanges) {
        setHasUnsavedChanges(true)
        setSaveStatus('unsaved')
        // Auto save ke localStorage untuk persist saat refresh
        saveToLocalStorage(newData)
      }
    },
    [saveToLocalStorage]
  )

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(
      `notulensi_data_${divisiId}_${prokerId}`
    )
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)

        // Konversi kembali DateTime ke date dan time terpisah untuk form
        if (parsed.date && parsed.date.includes('T')) {
          const dateTime = new Date(parsed.date)
          parsed.date = dateTime.toISOString().split('T')[0]
          parsed.time = dateTime.toTimeString().slice(0, 5)
        }

        setMeetingData(parsed)
        if (parsed.lastModified) {
          setLastSaved(new Date(parsed.lastModified))
        }
        lastSavedDataRef.current = JSON.stringify(parsed)
      } catch (error) {
        console.error('Error parsing saved data:', error)
      }
    }

    // Set initial load selesai
    setTimeout(() => {
      isInitialLoadRef.current = false
    }, 100)
  }, [divisiId, prokerId])

  // Prevent user from leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = e => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue =
          'Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2, 3, 4]
      }),
      Bold,
      Italic,
      Strike,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      HardBreak
    ],
    content:
      DOMPurify.sanitize(meetingData.content, {
        USE_PROFILES: { html: true }
      }) ||
      `
      <h2>Agenda Rapat</h2>
      <ol>
        <li>Pembukaan</li>
        <li>Laporan Kegiatan</li>
        <li>Pembahasan Program</li>
        <li>Penutup</li>
      </ol>
      <h2>Pembahasan</h2>
      <p>Mulai tulis notulensi di sini...</p>
      <h2>Keputusan</h2>
      <ul>
        <li>Keputusan 1</li>
        <li>Keputusan 2</li>
      </ul>
      <h2>Tindak Lanjut</h2>
      <p>Action items dan follow up...</p>
    `,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML()
      const updatedData = { ...meetingData, content: newContent }
      setMeetingData(updatedData)
      detectChanges(updatedData)
    }
  })

  // Handle form input changes
  const handleInputChange = (field, value) => {
    const updatedData = { ...meetingData, [field]: value }
    setMeetingData(updatedData)
    detectChanges(updatedData)
  }

  const toggleBold = () => editor?.chain().focus().toggleBold().run()
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run()
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run()
  const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run()
  const toggleBulletList = () =>
    editor?.chain().focus().toggleBulletList().run()
  const toggleOrderedList = () =>
    editor?.chain().focus().toggleOrderedList().run()
  const toggleBlockquote = () =>
    editor?.chain().focus().toggleBlockquote().run()

  const setHeading = level => {
    if (level === 0) {
      editor?.chain().focus().setParagraph().run()
    } else {
      editor?.chain().focus().toggleHeading({ level }).run()
    }
  }

  const exportToPdf = () => {
    const textContent = `
                        <main>
                          <section>
                            <h1>&#128221; NOTULENSI RAPAT ${meetingData.title.toUpperCase()}</h1>
                            <p>Tanggal: ${meetingData.date}</p>
                            <p>Waktu: ${meetingData.time}</p>
                            <p>Tempat: ${meetingData.location}</p>
                            <p>Peserta: ${meetingData.attendees}</p>
                          </section>

                          <section>
                            <h2>AGENDA:</h2>
                            <p>${meetingData.agenda}</p>
                          </section>
                          <section>
                            <h2>NOTULENSI:</h2>
                            ${editor?.getHTML()}
                          </section>

                          <p><em>Disimpan pada: ${new Date().toLocaleString('id-ID')}</em></p>
                        </main>
                        `

    const cleanContent = DOMPurify.sanitize(textContent || '', {
      USE_PROFILES: { html: true }
    })

    const printWindow = window.open('', '', 'width=800,height=600')
    printWindow.document.writeln(`
    <html>
      <head>
        <title>NOTULENSI ${meetingData.title.toUpperCase()}</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; }
          h1, h2 { margin-bottom: 0.5rem; }
          p { margin: 0.25rem 0; line-height: 1.6; }
          em { font-style: italic; color: gray; }
          ul, ol { padding-left: 1.5rem; }
          blockquote { border-left: 4px solid #ccc; padding-left: 1rem; color: #666; margin: 1rem 0; }
        </style>
      </head>
      <body>
        ${cleanContent}
      </body>
    </html>
  `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.onafterprint = () => printWindow.close()
    toast.success('Berhasil mengexport notulensi')
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-accentColor" />
              <h1 className="text-2xl font-bold">Pencatatan Notulensi</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                {saveStatus === 'saving' && (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-600">Menyimpan...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Tersimpan</span>
                  </>
                )}
                {saveStatus === 'unsaved' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-600">Belum Disimpan</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">Error</span>
                  </>
                )}
                {lastSaved && (
                  <span className="text-xs text-gray-500">
                    Terakhir disimpan: {lastSaved.toLocaleTimeString('id-ID')}
                  </span>
                )}
              </div>
              <Button
                onClick={handleManualSave}
                disabled={mutation.isPending || !hasUnsavedChanges}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  hasUnsavedChanges
                    ? 'bg-accentColor text-white hover:bg-accentColor/80'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
              <Button
                onClick={exportToPdf}
                className="flex items-center gap-2 px-4 py-2 bg-accentColor text-white rounded-lg hover:bg-accentColor/80 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Meeting Info Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Judul Rapat *
              </label>
              <input
                type="text"
                value={meetingData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                placeholder="Rapat Pengurus Harian"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Tanggal
              </label>
              <input
                type="date"
                value={meetingData.date}
                onChange={e => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Waktu
              </label>
              <input
                type="time"
                value={meetingData.time}
                onChange={e => handleInputChange('time', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tempat</label>
              <input
                type="text"
                value={meetingData.location}
                onChange={e => handleInputChange('location', e.target.value)}
                placeholder="Ruang Rapat / Online"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <Users className="w-4 h-4 inline mr-1" />
                Peserta Rapat
              </label>
              <textarea
                value={meetingData.attendees}
                onChange={e => handleInputChange('attendees', e.target.value)}
                placeholder="Daftar nama peserta rapat..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Agenda Rapat
              </label>
              <textarea
                value={meetingData.agenda}
                onChange={e => handleInputChange('agenda', e.target.value)}
                placeholder="Ringkasan agenda yang akan dibahas..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="rounded-lg shadow-sm border overflow-hidden">
          {/* Toolbar */}
          <div className=" border-b border-gray-200 p-3 flex flex-wrap gap-2">
            <div className="flex gap-1 border-r border-gray-300 pr-2">
              <Button
                onClick={toggleBold}
                className={`px-3 py-1 rounded text-sm font-bold text-white ${
                  editor?.isActive('bold')
                    ? 'bg-accentColor'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                B
              </Button>
              <Button
                onClick={toggleItalic}
                className={`px-3 py-1 rounded text-sm italic ${
                  editor?.isActive('italic')
                    ? 'bg-accentColor'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                I
              </Button>
              <Button
                onClick={toggleUnderline}
                className={`px-3 py-1 rounded text-sm underline ${
                  editor?.isActive('underline')
                    ? 'bg-accentColor'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                U
              </Button>
              <Button
                onClick={toggleStrike}
                className={`px-3 py-1 rounded text-sm line-through ${
                  editor?.isActive('strike')
                    ? 'bg-accentColor'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                S
              </Button>
            </div>

            <div className="flex gap-1 border-r border-gray-300 pr-2">
              <select
                value={
                  editor?.isActive('heading', { level: 1 })
                    ? 1
                    : editor?.isActive('heading', { level: 2 })
                      ? 2
                      : editor?.isActive('heading', { level: 3 })
                        ? 3
                        : editor?.isActive('heading', { level: 4 })
                          ? 4
                          : 0
                }
                onChange={e => setHeading(Number(e.target.value))}
                className="px-2 py-1 rounded text-sm border border-gray-300"
              >
                <option value={0}>Paragraf</option>
                <option value={1}>Judul Besar</option>
                <option value={2}>Judul Sedang</option>
                <option value={3}>Sub Judul</option>
                <option value={4}>Judul Kecil</option>
              </select>
            </div>

            <div className="flex gap-1">
              <Button
                onClick={toggleBulletList}
                className={`px-3 py-1 rounded text-sm ${
                  editor?.isActive('bulletList')
                    ? 'bg-accentColor'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                • Poin
              </Button>
              <Button
                onClick={toggleOrderedList}
                className={`px-3 py-1 rounded text-sm ${
                  editor?.isActive('orderedList')
                    ? 'bg-accentColor'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                1. Nomor
              </Button>
              <Button
                onClick={toggleBlockquote}
                className={`px-3 py-1 rounded text-sm ${
                  editor?.isActive('blockquote')
                    ? 'bg-accentColor'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Kutipan
              </Button>
            </div>
          </div>

          {/* Editor Content */}
          <div className="min-h-96 p-6">
            <EditorContent
              editor={editor}
              className="prose prose-lg max-w-none focus:outline-none min-h-80"
            />
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-6 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 mt-0.5">ℹ️</div>
            <div className="text-sm">
              <p className="font-medium mb-1">Tips Pencatatan Notulensi:</p>
              <ul className="space-y-1">
                <li>
                  • Data akan tersimpan secara lokal saat Anda mengetik untuk
                  mencegah kehilangan data
                </li>
                <li>• Klik tombol "Simpan" untuk menyimpan ke server</li>
                <li>
                  • Gunakan heading untuk membagi bagian (Agenda, Pembahasan,
                  Keputusan, dll)
                </li>
                <li>
                  • Gunakan bullet points untuk mencatat poin-poin penting
                </li>
                <li>• Data akan tetap ada meskipun halaman di-refresh</li>
                <li>{`• Klik "Export PDF" untuk mengunduh notulensi`}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotulensApp
