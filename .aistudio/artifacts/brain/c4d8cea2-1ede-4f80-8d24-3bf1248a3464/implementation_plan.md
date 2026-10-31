# Rencana Implementasi: Visualisasi Data Tren Kunjungan UKS di Dasbor Nakes & Rangkuman Sistem NADI

## 1. Ringkasan Kebutuhan
Berdasarkan arahan dan jawaban klarifikasi pengguna:
1. **Visualisasi Data Dasbor Nakes**:
   - Menampilkan tren jumlah kunjungan UKS berdasarkan kategori keluhan per bulan menggunakan **Recharts**.
   - Jenis grafik: **Grafik Batang Bertumpuk (Stacked Bar Chart)** dengan opsi tombol toggle cepat untuk beralih ke **Grafik Garis Tren (Line Chart)**.
   - Rentang data: **6 bulan terakhir** (misal: Mei – Oktober) mencakup kategori keluhan khas asrama/boarding school (ISPA/Flu, Gangguan Pencernaan/Maag/Diare, Kulit/Skabies/Gatal, Cedera Fisik/Olahraga/P3K, Kelelahan/Sakit Kepala/Anemia).
   - Fitur pendukung: Filter seleksi kategori keluhan, kartu metrik ringkasan (Total Kunjungan, Kategori Tertinggi, Laju Pemulihan, Klaster Aktif), dan **Kartu Insight Epidemiologi Otomatis** (misal: lonjakan kasus musiman & rekomendasi pencegahan asrama).
2. **Rangkuman Lengkap Aplikasi**:
   - Menyediakan rangkuman menyeluruh arsitektur, peran pengguna, alur kerja triase AI, dan manfaat sistem NADI dalam bahasa yang mudah dipahami namun lengkap.

---

## 2. Arsitektur & Desain Visualisasi Data (`UksTrendAnalytics.tsx` / `NakesDashboard.tsx`)

### A. Struktur Data & Kategori
Data tren 6 bulan per kategori keluhan:
- **Bulan**: Mei, Juni, Juli, Agustus, September, Oktober
- **Kategori**:
  1. `ispa`: ISPA & Gejala Flu (Batuk, pilek, sakit tenggorokan)
  2. `pencernaan`: Gangguan Saluran Cerna (Dispepsia, maag, diare)
  3. `kulit`: Masalah Kulit & Tungau Asrama (Skabies, dermatitis alergi)
  4. `cedera`: Cedera Olahraga & Trauma Ringan (Terkilir, lecet, hematoma)
  5. `kelelahan`: Sakit Kepala, Kelelahan Belajar & Tanda Anemia
- **Palet Warna Representatif & Aksesibel**:
  - ISPA: Biru Cerah (`#3b82f6`)
  - Pencernaan: Oranye Hangat (`#f97316`)
  - Kulit / Skabies: Ungu Lembayung (`#a855f7`)
  - Cedera: Merah Muda / Mawar (`#f43f5e`)
  - Kelelahan: Kuning Keemasan (`#eab308`)

### B. Komponen Recharts yang Digunakan
- `ResponsiveContainer`: Penyesuaian responsif layar desktop maupun tablet UKS.
- `BarChart`, `Bar`: Batang bertumpuk (`stackId="a"`) untuk melihat akumulasi total kunjungan per bulan serta proporsi antar keluhan.
- `LineChart`, `Line`: Garis tren multi-kategori dengan kurva mulus (`monotone`) dan penanda titik data interaktif (`activeDot`).
- `XAxis`, `YAxis`, `CartesianGrid`: Grid bergaris halus dengan label bulan dan kuantitas santri yang jelas.
- `Tooltip`: Kustomisasi tooltip yang menampilkan rincian pasien, nama keluhan, dan persentase kontribusi.
- `Legend`: Legenda interaktif untuk mengaktifkan/menonaktifkan sorotan kategori tertentu.

### C. Kontrol Interaktif & Navigasi
1. **Tab Switcher di Dasbor Nakes**:
   - Tab 1: **"Antrean & Rekam Klinis"** (alur triase, pencatatan rekam medis, TTV, rujukan).
   - Tab 2: **"Analisis & Tren Kunjungan UKS"** (pusat data visual Recharts, statistik morbiditas, dan tren klaster).
2. **Kontrol Visualisasi**:
   - Tombol toggle: `[Grafik Batang Bertumpuk]` vs `[Grafik Garis Tren]`.
   - Filter Kategori: Opsi `Semua Kategori` atau fokus pada kategori tertentu (misal: hanya pantau Penyakit Kulit/Skabies).
   - Kartu Metrik Cepat:
     - Total Kunjungan UKS 6 Bulan Terakhir
     - Keluhan Terbanyak (Dominan)
     - Tren Kenaikan/Penurunan dibanding bulan sebelumnya
     - Rasio Rujukan Rumah Sakit vs Rawat Mandiri
3. **Kartu Insight Epidemiologi Otomatis (Surveilans Asrama)**:
   - Sorotan otomatis terhadap lonjakan keluhan di bulan pergantian musim atau awal semester (misal: infeksi skabies meningkat pada santri baru di bulan Juli/Agustus).
   - Rekomendasi operasional untuk Kepala Asrama dan UKS (misal: program sterilisasi kasur air panas massal, pembagian vitamin C).

---

## 3. Langkah Pelaksanaan Teknis
1. **Pemeriksaan Komponen & Impor**:
   - Memastikan `recharts` diimpor dengan benar (`ResponsiveContainer`, `BarChart`, `Bar`, `LineChart`, `Line`, `XAxis`, `YAxis`, `Tooltip`, `Legend`, `CartesianGrid`).
2. **Penyusunan Komponen Visualisasi Data**:
   - Membuat komponen modular atau menyatukannya secara rapi di dalam `src/components/NakesDashboard.tsx`.
   - Menambahkan dataset realistis 6 bulan dengan metrik teragregasi.
   - Mengimplementasikan state toggle grafik (Bar vs Line), state filter kategori, dan kartu insight dinamis.
3. **Integrasi ke Dasbor Nakes**:
   - Menambahkan navigasi tab elegan di bawah header profil nakes, sehingga staf medis dapat beralih cepat antara operasional pasien langsung dan analisis epidemiologi.
4. **Verifikasi & Pengujian**:
   - Menjalankan `compile_applet` untuk memastikan tidak ada kesalahan kompilasi TypeScript atau CSS Tailwind.
   - Menguji interaktivitas toggle chart, tooltip hover, dan filter kategori.
5. **Penyajian Dokumentasi Lengkap Aplikasi**:
   - Menyertakan rangkuman komprehensif sistem NADI (tujuan, arsitektur 3 peran pengguna, protokol triase 3 level, fitur unggulan, dan keunggulan boarding school) pada respons akhir.
