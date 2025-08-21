# Dokumentasi Aplikasi Kegiatan.koe

Dokumen ini menjelaskan arsitektur, alur kerja, dan struktur proyek dari aplikasi **Kegiatan.koe**.

## 1. Tujuan Aplikasi

**Kegiatan.koe** adalah sebuah aplikasi berbasis web yang dirancang untuk membantu organisasi (khususnya organisasi mahasiswa atau tim kecil) dalam mengelola semua aspek kegiatan mereka. Aplikasi ini memfasilitasi manajemen program kerja, tugas, divisi, keuangan, dan pelaporan dalam satu platform terpusat.

## 2. Konsep Inti & Model Data

Aplikasi ini dibangun di atas beberapa model data utama yang saling berhubungan. Model ini didefinisikan dalam `prisma/schema.prisma`.

- **`User`**: Merepresentasikan pengguna individu. Setiap pengguna memiliki data personal dan terhubung dengan organisasi melalui `Organisasi_member`.
- **`Organisasi`**: Entitas utama yang menaungi semua data. Setiap program kerja, divisi, dan anggota terikat pada satu organisasi.
- **`Organisasi_member`**: Tabel penghubung yang mendefinisikan peran (`role`) seorang `User` dalam sebuah `Organisasi`.
- **`Proker` (Program Kerja)**: Kegiatan atau proyek utama yang memiliki jangka waktu, deskripsi, dan penanggung jawab. Ini adalah "wadah" untuk `Divisi` dan `Tugas`.
- **`Divisi`**: Sub-unit di dalam sebuah `Proker` yang bertanggung jawab atas bagian tertentu dari program kerja. Setiap divisi memiliki anggota (`AnggotaDivisi`).
- **`AnggotaDivisi`**: Tabel penghubung yang menempatkan `User` ke dalam `Divisi` tertentu dengan jabatan spesifik (Kordinator, Sekertaris, Staff).
- **`Tugas`**: Unit pekerjaan terkecil yang dapat ditugaskan kepada anggota divisi. Tugas memiliki status (`TODO`, `INPROGRESS`, `REVIEW`, `DONE`) dan prioritas, yang memungkinkan implementasi papan Kanban.
- **`rab` (Rencana Anggaran Biaya)**: Catatan untuk item-item anggaran yang terkait dengan `Organisasi`, `Proker`, atau `Divisi`.
- **`Notulensi`**: Catatan rapat yang bisa terhubung dengan `Organisasi`, `Proker`, atau `Divisi`.

## 3. Alur Pengguna (User Flow)

### a. Autentikasi & Onboarding
1.  **Pendaftaran/Login**: Pengguna melakukan autentikasi menggunakan layanan eksternal (Clerk), seperti yang ditunjukkan oleh adanya `clerkId` pada model `User` dan direktori `sign-in`.
2.  **Onboarding**: Setelah login pertama kali, pengguna kemungkinan akan melalui proses onboarding (`/onboarding`) untuk melengkapi profil atau membuat/bergabung dengan sebuah organisasi.

### b. Alur Utama Aplikasi
Setelah login dan menjadi bagian dari sebuah organisasi, pengguna akan masuk ke dalam *layout* utama yang berada di `src/app/(fetures)/[orgSlug]/`.

1.  **Pemilihan Organisasi**: URL dengan `[orgSlug]` menandakan bahwa semua data yang ditampilkan berada dalam konteks organisasi yang sedang aktif.
2.  **Dashboard (`/dashboard`)**: Halaman utama yang kemungkinan menampilkan ringkasan statistik, tugas yang akan datang, atau pembaruan penting lainnya.
3.  **Manajemen Program Kerja (`/proker`)**:
    - Pengguna dapat melihat daftar `Proker` yang ada.
    - Terdapat fungsionalitas untuk membuat `Proker` baru (`CreateProker.js`).
    - Pengguna dapat melihat detail setiap `Proker`, yang di dalamnya terdapat `Divisi`.
4.  **Manajemen Tugas (`/tugas`)**:
    - Fitur ini kemungkinan besar diimplementasikan sebagai **Papan Kanban** (berdasarkan komponen `KanbanBoard.js`, `DraggableItem.js`, dll).
    - Pengguna dapat melihat `Tugas` berdasarkan statusnya (To Do, In Progress, etc.).
    - Pengguna dapat membuat tugas baru dan menugaskannya ke anggota divisi.
5.  **Manajemen Keuangan (`/keuangan`)**:
    - Pengguna dapat melihat dan mengelola Rencana Anggaran Biaya (`rab`).
    - Terdapat tabel untuk menampilkan item-item anggaran (`rabTable.js`).
6.  **Pelaporan (`/laporan`)**:
    - Aplikasi memiliki fitur reporting yang kuat, terlihat dari banyaknya komponen laporan di `src/components/reports/`.
    - Pengguna dapat men-generate berbagai jenis laporan seperti Daftar Anggota, Kinerja Divisi, Progres Tugas, Laporan RAB, dll.

## 4. Struktur Proyek

Proyek ini menggunakan Next.js App Router, yang sebagian besar logikanya terorganisir di dalam direktori `src/`.

- **`src/app/(fetures)`**: Direktori utama yang berisi semua halaman dan fitur yang dapat diakses pengguna setelah login.
- **`src/app/api`**: Berisi endpoint API backend. Strukturnya mengikuti pola `controllers` (menerima request dan mengirim response) dan `services` (berisi logika bisnis).
- **`src/components`**: Kumpulan komponen React yang dapat digunakan kembali. Dikelompokkan berdasarkan fitur (misalnya, `board`, `proker`, `reports`) dan komponen UI umum (`ui`).
- **`src/lib`**: Berisi utilitas dan inisialisasi library, seperti koneksi Prisma (`prisma.js`) dan `hasPermission.js` untuk pengecekan hak akses.
- **`src/schemas`**: Berisi skema validasi data (kemungkinan menggunakan Zod) untuk frontend dan backend, memastikan konsistensi data.
- **`prisma`**: Berisi skema database (`schema.prisma`) dan file migrasi.
- **`public`**: Aset statis seperti gambar dan ikon.

## 5. Arsitektur & Logika Bisnis

- **Frontend**: Dibangun dengan React dan Next.js. Komponen UI dibuat menggunakan `shadcn/ui` (terlihat dari `components.json` dan struktur `src/components/ui`).
- **Backend**: API dibuat menggunakan Next.js Route Handlers di dalam `src/app/api`.
- **Database**: Menggunakan MySQL sebagai database, dengan Prisma sebagai ORM untuk interaksi yang aman dan efisien.
- **Logika Bisnis**: Terpusat di dalam file-file `*-service.js` di `src/app/api/services/`. Setiap service bertanggung jawab untuk satu entitas (misalnya, `proker-service.js` menangani semua logika terkait Program Kerja).
- **Autentikasi & Otorisasi**: Autentikasi ditangani oleh Clerk. Logika otorisasi (pengecekan hak akses) kemungkinan besar diimplementasikan dalam `src/lib/hasPermission.js` dan digunakan di seluruh aplikasi untuk melindungi data dan fitur.
