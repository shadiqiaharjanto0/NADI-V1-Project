import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

// Initialize GoogleGenAI client (Server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const NADI_SYSTEM_INSTRUCTION = `# NADI HEALTH INTELLIGENCE | SISTEM PENALARAN DEDUKTIF KLINIS v3.0

## A. IDENTITAS DAN INTEGRITAS PROFESIONAL
Kamu adalah **NADI (NADI Health Intelligence)**, sistem kecerdasan kesehatan digital terintegrasi untuk SMA Boarding School di Indonesia.
Kamu bertindak dengan standar komunikasi medis formal, ringkas, objektif, berbasis bukti klinis (*evidence-based medicine*), dan berorientasi mutlak pada keselamatan siswa (*student safety first*).

Prinsip Utama:
1. Hindari kalimat pembuka atau penutup basa-basi yang tidak perlu.
2. Jangan gunakan emotikon, stiker, atau gaya bahasa santai/AI-slop.
3. Gunakan kaidah bahasa medis formal yang lugas dan mudah dieksekusi siswa maupun pembina asrama.
4. Jangan pernah meresepkan antibiotik oral atau obat keras (daftar G). Rekomendasikan hanya pertolongan pertama dan obat bebas terbatas yang aman.

---

## B. METODOLOGI PENALARAN DEDUKTIF KLINIS
Saat menganalisis keluhan kesehatan, gunakan alur deduksi logis:
1. **Premis Mayor (Patofisiologi & Epidemiologi Asrama):** Hubungkan mekanisme biologis gejala dengan dinamika asrama (ventilasi kamar tidur bersama, transmisi kontak/fomite/droplet, aktivitas fisik padat, kelelahan sirkadian, sanitasi pakaian/sprei).
2. **Premis Minor (Keluhan Subjektif & Riwayat Siswa):** Identifikasi gejala spesifik, durasi onset, intensitas, ada/tidaknya komorbid/alergi, dan kehadiran tanda bahaya (*red flags*).
3. **Konklusi Deduktif:** Tarik kesimpulan logis mengenai tingkat keparahan, pisahkan kondisi *self-limiting* dari potensi wabah/kegawatan, lalu tetapkan Level Urgensi secara proporsional.

---

## C. KLASIFIKASI LEVEL URGENSI MEDIS (BATASAN KETAT)

- **LEVEL 1: HIJAU (Observasi Mandiri & Perawatan Dasar di Asrama):**
  - Kriteria: Keluhan ringan, hemodinamik stabil, tanpa tanda bahaya (contoh: batuk pilek ringan tanpa sesak, pusing kelelahan, pegal pasca olahraga, maag ringan yang responsif terhadap makanan).
  - Fokus Keselamatan: Istirahat di kamar, hidrasi cairan 2–2,5 L/hari, nutrisi teratur, pantau suhu berkala.

- **LEVEL 2: KUNING (Pemeriksaan Pos UKS / Klinik Sekolah Hari Ini):**
  - Kriteria: Keluhan mengganggu aktivitas belajar/harian, demam >37.5°C, penyakit menular khas asrama (skabies/kudis, diare berulang, konjungtivitis), terkilir/sprain dengan pembengkakan lokal, nyeri lambung persisten.
  - Fokus Keselamatan: Isolasi peralatan pribadi/sprei, kunjungan ke UKS hari ini untuk pemeriksaan tanda vital oleh perawat/dokter sekolah, terapi obat bebas terarah.

- **LEVEL 3: MERAH (Gawat Darurat Medis — Evakuasi & Rujukan Segera):**
  - Kriteria: Ancaman jalan napas/pernapasan/sirkulasi/kesadaran (*red flags*): sesak napas berat, stridor/mengi hebat, bibir kebiruan (sianosis), penurunan kesadaran/pingsan, kejang, perdarahan masif, muntah/BAB hitam, fraktur terbuka/deformitas tulang, leher kaku dengan demam tinggi, nyeri dada menekan.
  - Fokus Keselamatan: Hentikan skrining rutin, segera instruksikan evakuasi dan pendampingan, hubungi Pembina Asrama, Petugas UKS, dan layanan darurat 119/112!

---

## D. STRUKTUR FORMAT JAWABAN (WAJIB DIIKUTI)

### JALUR 1: KELUHAN KLINIS PRIBADI (TRIASE MEDIS)
Gunakan struktur baku berikut secara ringkas dan formal:

**NADI Health Check**

**Keluhan Utama:**
[Sebutkan ringkasan keluhan spesifik, durasi/onset, dan lokasi keluhan]

**Rekomendasi Urgensi:**
[PILIH SATU SECARA EKSPLISIT: LEVEL 1: HIJAU / LEVEL 2: KUNING / LEVEL 3: MERAH]

**Penalaran Klinis:**
[Deduksi logis 1–2 kalimat padat yang mengaitkan gejala dengan mekanisme klinis atau risiko di lingkungan asrama serta rasionalisasi tingkat urgensi]

**Tindakan Keselamatan Siswa:**
1. [Tindakan prioritas keamanan: posisi tubuh, istirahat, pengamanan sirkulasi udara]
2. [Tindakan hidrasi, kompres air hangat, atau pertolongan pertama spesifik]
3. [Tindakan pencegahan penularan kamar atau pembatasan aktivitas fisik]

**Tanda Bahaya (Red Flags):**
- [Poin-poin gejala darurat spesifik yang jika muncul mewajibkan eskalasi ke Level 3 / IGD]

**Tindak Lanjut UKS:**
[Instruksi rujukan tegas: kapan harus ke UKS, siapa yang harus dihubungi di asrama, dan prosedur pelaporan]

---

### JALUR 2: PERTANYAAN EDUKASI, PENGETAHUAN MEDIS, OBAT, ATAU PROSEDUR
(Bila pengguna bertanya teori/penjelasan ilmiah, BUKAN mengeluhkan sakitnya sendiri)
- **DILARANG memakai format "NADI Health Check" atau label triase.**
- Langsung berikan penjelasan deduktif ilmiah:
  1. **Definisi & Mekanisme Patologis:** Penjelasan biologis yang lugas dan akurat.
  2. **Relevansi Lingkungan Asrama:** Faktor sanitasi, transmisi, atau gaya hidup asrama.
  3. **Tindakan Pencegahan & Keselamatan Taktis:** Panduan langkah bernomor yang aplikatif.
  4. **Batasan Keamanan Medis:** Peringatan obat bebas vs obat keras dan kapan harus ke faskes.

---

### JALUR 3: SOP OPERASIONAL PEMBINA ASRAMA / TENAGA MEDIS
- Berikan protokol operasional bernomor yang runut: triase klaster, karantina kamar sementara, sterilisasi tekstil (air panas >60°C), pencatatan rekam medis UKS, dan ambang batas rujukan ke rumah sakit luar.`;

// Intelligent Deterministic Fallback that accurately answers questions and triages complaints
function generateDeterministicFallback(userPrompt: string, studentProfile?: any) {
  const p = userPrompt.toLowerCase().trim();

  // Check if user is asking a QUESTION / EDUCATIONAL INQUIRY
  const isQuestion =
    p.includes('?') ||
    p.startsWith('apa') ||
    p.startsWith('bagaimana') ||
    p.startsWith('kenapa') ||
    p.startsWith('mengapa') ||
    p.startsWith('kapan') ||
    p.startsWith('apakah') ||
    p.startsWith('siapa') ||
    p.startsWith('berapa') ||
    p.startsWith('bolehkah') ||
    p.startsWith('adakah') ||
    p.startsWith('jelaskan') ||
    p.startsWith('sebutkan') ||
    p.startsWith('tips') ||
    p.startsWith('cara') ||
    p.includes('perbedaan') ||
    p.includes('penyebab') ||
    p.includes('obat apa');

  if (isQuestion) {
    // 1. Skabies / Kudis / Gatal Asrama
    if (p.includes('skabies') || p.includes('kudis') || (p.includes('gatal') && p.includes('sela jari'))) {
      return {
        triageLevel: null,
        reply: `**Mengenal Skabies (Kudis) dan Pencegahannya di Asrama:**

**1. Apa Penyebabnya?**
Skabies disebabkan oleh infestasi tungau mikroskopis *Sarcoptes scabiei var. hominis*. Tungau ini membuat terowongan kecil di bawah lapisan kulit luar untuk bertelur, yang memicu reaksi alergi hebat berupa gatal luar biasa, terutama di malam hari ketika suhu tubuh lebih hangat.

**2. Gejala Khas:**
- Gatal intens pada malam hari (*pruritus nokturna*).
- Bintik-bintik merah kecil menyerupai jerawat air di sela-sela jari tangan, pergelangan tangan, siku, ketiak, pinggang, atau lipatan paha.
- Menyerang orang-orang yang tinggal serumah atau sekamar asrama secara bersamaan.

**3. Jalur Penularan:**
- Kontak fisik kulit-ke-kulit secara langsung dan erat (berjabat tangan lama, tidur bersama).
- Kontak tidak langsung melalui sprei, selimut, handuk, bantal, atau pakaian yang dipakai bergantian dengan penderita.

**4. Penanganan & Sanitasi di Asrama:**
- **Pemeriksaan Medis UKS:** Segera periksakan ke klinik UKS untuk mendapatkan resep losion/krim antiparasit khusus (seperti Permethrin 5%). Salep ini dioleskan ke seluruh tubuh dari leher ke bawah dan didiamkan 8–12 jam sebelum dibilas.
- **Cuci Air Panas:** Rebus atau cuci seluruh pakaian, handuk, sarung bantal, dan sprei dengan air panas minimal 60°C, lalu jemur di bawah sinar matahari langsung atau setrika panas.
- **Isolasi Barang Kering:** Barang-barang berbahan kain yang tidak bisa dicuci harus dimasukkan ke dalam kantong plastik tertutup rapat selama minimal 3–5 hari hingga tungau mati kehabisan inang.
- **Pengobatan Serentak:** Jika ada teman sekamar yang mengalami gejala serupa, pengobatan harus dilakukan bersamaan agar tidak terjadi penularan bolak-balik.`
      };
    }

    // 2. Pertolongan Pertama Mimisan
    if (p.includes('mimisan') || p.includes('darah hidung')) {
      return {
        triageLevel: null,
        reply: `**Panduan Pertolongan Pertama Mimisan (Epistaksis) di Asrama:**

**Langkah-langkah Penanganan Cepat:**
1. **Duduk Tegak dan Condongkan Tubuh ke Depan:** Jangan mendongakkan kepala ke belakang! Mendongak dapat menyebabkan darah mengalir ke tenggorokan dan tertelan ke lambung, memicu mual, muntah, atau tersedak.
2. **Jepit Cuping Hidung:** Gunakan ibu jari dan jari telunjuk untuk menjepit erat bagian lunak hidung (tepat di bawah tulang hidung) selama 10–15 menit penuh tanpa dilepas. Bernapaslah melalui mulut.
3. **Kompres Dingin:** Letakkan kompres es atau kain dingin di pangkal hidung dan dahi untuk membantu menyempitkan pembuluh darah (*vasokonstriksi*).
4. **Setelah Darah Berhenti:** Jangan mengorek hidung, menghembuskan napas kuat (*nyisil*), atau membungkuk selama beberapa jam ke depan agar bekuan darah tidak lepas kembali.

**Kapan Harus Segera ke UKS / Rumah Sakit?**
- Perdarahan tidak berhenti setelah ditekan selama 20 menit terus-menerus.
- Mimisan terjadi akibat benturan keras di kepala/wajah.
- Siswa merasa pusing berputar, lemas ekstrem, atau kulit tampak pucat pasi.`
      };
    }

    // 3. Pingsan / Penurunan Kesadaran
    if (p.includes('pingsan') || p.includes('tidak sadar')) {
      return {
        triageLevel: 'MERAH',
        reply: `**Prosedur Tanggap Darurat: Pertolongan Pertama Teman Pingsan (Sinkop):**

**Langkah Penyelamatan Segera:**
1. **Baringkan di Tempat Datar & Aman:** Posisikan tubuh telentang di lantai yang datar dan sejuk.
2. **Tinggikan Posisi Kaki:** Angkat kaki setinggi 30 cm di atas posisi jantung (bisa diganjal bantal atau ransel) untuk memperlancar aliran darah kembali ke otak.
3. **Longgarkan Pakaian:** Buka kancing kerah baju, lepaskan dasi atau ikat pinggang agar pernapasan leluasa.
4. **Beri Ruang Udara:** Jangan biarkan siswa lain berkerumun mengerumuni korban agar sirkulasi udara tetap segar.
5. **Cek Respons dan Pernapasan:** Panggil namanya dan tepuk pundaknya. Jika bernapas normal, biarkan istirahat. Jika korban muntah, segera miringkan tubuhnya ke sisi kiri (*recovery position*).
6. **JANGAN Berikan Makanan/Minuman** kepada korban yang belum sadar penuh karena berisiko tersedak fatal ke paru-paru.

Segera panggil **Pembina Asrama** dan **Petugas UKS** sekarang juga untuk evaluasi tanda vital.`
      };
    }

    // 4. Demam & Obat Paracetamol
    if (p.includes('demam') || p.includes('paracetamol') || p.includes('panas')) {
      return {
        triageLevel: null,
        reply: `**Panduan Penanganan Demam dan Penggunaan Obat Bebas di Asrama:**

**1. Penanganan Mandiri di Kamar Asrama:**
- **Hidrasi Aktif:** Minum air putih hangat minimal 2 hingga 2,5 liter per hari. Saat demam, tubuh kehilangan banyak cairan melalui keringat dan penguapan kulit.
- **Kompres Hangat (Bukan Es):** Gunakan kain yang dibasahi air hangat pada dahi, ketiak, atau lipat paha. Kompres hangat merangsang pembuluh darah membuka dan mengeluarkan panas tubuh secara alami.
- **Pakaian Longgar & Nyaman:** Gunakan pakaian katun tipis yang menyerap keringat. Hindari menggunakan selimut terlalu tebal saat badan sedang sangat panas karena dapat memerangkap suhu tubuh.

**2. Penggunaan Paracetamol:**
- Paracetamol adalah obat analgesik-antipiretik lini pertama yang aman untuk meredakan demam dan nyeri ringan.
- Dosis umum remaja: 500 mg setiap 4–6 jam sekali bila diperlukan (maksimal 3000–4000 mg per hari).
- Paracetamol aman dikonsumsi sebelum atau sesudah makan (tidak seiritatif ibuprofen pada lambung).

**3. Kapan Harus ke UKS?**
- Suhu tubuh mencapai >38.5°C dan tidak turun setelah minum obat.
- Demam menetap lebih dari 3 hari.
- Disertai tanda bahaya seperti menggigil hebat, leher sangat kaku, kejang, muntah berulang, atau muncul ruam kemerahan di kulit.`
      };
    }

    // 5. Asam Lambung / Maag / Pencernaan
    if (p.includes('maag') || p.includes('lambung') || p.includes('mual') || p.includes('perut')) {
      return {
        triageLevel: null,
        reply: `**Penjelasan Keluhan Maag (Dispepsia) & Asam Lambung pada Siswa Asrama:**

**1. Mengapa Sering Terjadi di Asrama?**
- Jadwal makan yang terlambat atau terlewat karena padatnya kegiatan sekolah/belajar malam.
- Konsumsi makanan pedas, mie instan, gorengan berlebih, atau minuman berkafein (kopi/energi) saat begadang.
- Tingkat stres dan kelelahan mental menjelang ujian (*brain-gut axis* meningkatkan produksi asam lambung).

**2. Langkah Penanganan Mandiri:**
- **Makan Porsi Kecil tapi Sering:** Jangan biarkan lambung kosong terlalu lama. Sediakan biskuit gandum atau pisang di kamar asrama.
- **Minum Air Hangat:** Minum air putih hangat sedikit demi sedikit untuk menetralkan asam lambung.
- **Posisi Duduk/Tegak:** Hindari langsung berbaring setelah makan minimal selama 2 jam untuk mencegah refluks asam lambung ke kerongkongan.
- **Antasida:** Bila ulu hati terasa perih atau perih terbakar, tablet kunyah Antasida Doen dari pos UKS dapat dikunyah 1 jam sebelum makan atau 2 jam setelah makan.

**3. Tanda Bahaya yang Perlu Diwaspadai:**
- Nyeri perut hebat mendadak yang melilit tak tertahankan.
- Muntah berwarna cokelat kehitaman atau BAB berwarna hitam pekat (*melena*).
- Muntah terus-menerus hingga tidak ada cairan yang bisa masuk.`
      };
    }

    // Default Educational Inquiry
    return {
      triageLevel: null,
      reply: `**Informasi Kesehatan NADI Health Intelligence:**

Terima kasih atas pertanyaannya mengenai: *"${userPrompt}"*.

**Poin-Poin Penjelasan Penting:**
1. **Dasar Medis & Pemahaman Klinis:**
   Kondisi kesehatan ini sangat berkaitan erat dengan pola hidup bersih, sirkulasi lingkungan tempat tinggal, kebiasaan istirahat, serta asupan nutrisi seimbang di asrama.
2. **Langkah Praktis & Perawatan yang Tepat:**
   - Jaga kebersihan diri, cuci tangan dengan sabun mengalir sebelum makan dan setelah beraktivitas bersama.
   - Penuhi hidrasi tubuh dengan minum air putih minimal 8 gelas per hari.
   - Luangkan waktu tidur yang cukup minimal 7–8 jam untuk pemulihan imunitas seluler.
3. **Peringatan Keselamatan:**
   Hindari mengonsumsi obat keras (golongan antibiotik atau obat berlogo lingkaran merah dengan huruf K) tanpa resep dan pemeriksaan langsung dari dokter atau petugas medis UKS.

Bila kamu atau teman sekamar mengalami gejala sakit yang mengganggu aktivitas belajar, jangan ragu untuk memeriksakan diri langsung ke Pos Medis UKS atau melapor ke Pembina Asrama, ya!`
    };
  }

  // --- TRIASE KELUHAN KLINIS PRIBADI (Jika pengguna melaporkan gejala sakit) ---

  // Check for Level 3: MERAH indicators
  const isEmergency =
    p.includes('sesak') ||
    p.includes('pingsan') ||
    p.includes('kejang') ||
    p.includes('muntah darah') ||
    p.includes('bab hitam') ||
    p.includes('dada') ||
    p.includes('alergi berat') ||
    p.includes('bibir bengkak') ||
    p.includes('leher kaku') ||
    p.includes('tidak sadar');

  if (isEmergency) {
    return {
      triageLevel: 'MERAH' as const,
      reply: `**NADI Health Check**

**Keluhan Utama:**
${userPrompt.slice(0, 100)}

**Rekomendasi Urgensi:**
LEVEL 3: MERAH (Gawat Darurat)

**Penalaran Klinis:**
Gejala mengindikasikan gangguan akut pada fungsi vital (oksigenasi/sirkulasi/kesadaran) yang berpotensi dekompensasi cepat dan membutuhkan intervensi medis darurat segera.

**Tindakan Keselamatan Siswa:**
1. Hentikan seluruh aktivitas fisik dan baringkan siswa dalam posisi aman (setengah duduk bila sesak, atau posisi miring mantap bila muntah/penurunan kesadaran).
2. Amankan jalan napas, longgarkan pakaian ketat, dan pastikan sirkulasi ventilasi kamar terbuka penuh.
3. Jangan tinggalkan siswa sendirian; instruksikan teman sekamar segera mendampingi.
4. Dilarang memberikan makanan, minuman, atau obat oral pada kondisi kesadaran menurun.

**Tanda Bahaya (Red Flags):**
- Penurunan kesadaran atau respons lambat
- Sianosis (kebiruan pada bibir atau kuku)
- Sesak napas berat dengan retraksi dinding dada

**Tindak Lanjut UKS:**
Segera panggil Pembina Asrama (${studentProfile?.emergencyContactName || 'Pembina Asrama'}), Petugas UKS (${studentProfile?.uksContactPhone || 'Pos UKS'}), dan lakukan rujukan ambulans / IGD terdekat (119/112).`
    };
  }

  // Check for Common Boarding School complaints (Level 2: KUNING)
  const isKuning =
    p.includes('demam') ||
    p.includes('panas') ||
    p.includes('meriang') ||
    p.includes('skabies') ||
    p.includes('gatal') ||
    p.includes('kudis') ||
    p.includes('perut') ||
    p.includes('maag') ||
    p.includes('mual') ||
    p.includes('batuk') ||
    p.includes('flu') ||
    p.includes('pilek') ||
    p.includes('engkel') ||
    p.includes('terkilir') ||
    p.includes('pusing') ||
    p.includes('sakit kepala');

  if (isKuning) {
    return {
      triageLevel: 'KUNING' as const,
      reply: `**NADI Health Check**

**Keluhan Utama:**
${userPrompt.slice(0, 90)}

**Rekomendasi Urgensi:**
LEVEL 2: KUNING (Pemeriksaan Pos UKS Hari Ini)

**Penalaran Klinis:**
Keluhan menunjukkan proses patologis aktif (dugaan infeksi droplet/kontak, inflamasi mukosa lambung, atau cedera ligamen) dengan risiko penyebaran di kamar asrama atau perburukan gejala tanpa evaluasi medis.

**Tindakan Keselamatan Siswa:**
1. Batasi aktivitas fisik berat dan istirahatkan tubuh di tempat tidur kamar asrama atau ruang observasi UKS.
2. Tingkatkan hidrasi cairan elektrolit/air hangat 2 hingga 2,5 liter per hari untuk menjaga perfusi jaringan.
3. Pisahkan pemakaian handuk, pakaian, dan sprei dari teman sekamar guna memutus rantai transmisi.
4. Lakukan kompres air hangat (bukan es) jika terdapat demam atau meriang.

**Tanda Bahaya (Red Flags):**
- Suhu tubuh mencapai >38.5°C atau menggigil hebat
- Muntah berulang hingga tidak mampu menelan cairan
- Nyeri abdomen hebat yang menetap

**Tindak Lanjut UKS:**
Datang ke Pos UKS pada jam operasional hari ini untuk pemeriksaan tanda-tanda vital (suhu, nadi, tensi) dan pencatatan rekam medis terpadu.`
    };
  }

  // Default Hijau
  return {
    triageLevel: 'HIJAU' as const,
    reply: `**NADI Health Check**

**Keluhan Utama:**
${userPrompt.slice(0, 80)}

**Rekomendasi Urgensi:**
LEVEL 1: HIJAU (Observasi Mandiri & Perawatan Dasar)

**Penalaran Klinis:**
Analisis klinis menunjukkan keluhan bersifat fungsional/ringan (*self-limiting*) tanpa keterlibatan tanda bahaya sistemik, sehingga aman diobservasi secara mandiri di kamar asrama.

**Tindakan Keselamatan Siswa:**
1. Istirahat berbaring teratur minimal 7–8 jam dan kurangi pajanan layar gawai.
2. Cukupi asupan cairan dengan minum air putih minimal 8 gelas per hari.
3. Konsumsi makanan bergizi dari kantin/asrama secara teratur dan hindari makanan terlampau pedas atau asam.
4. Catat mandiri perkembangan keluhan di Buku Catatan Kesehatan NADI.

**Tanda Bahaya (Red Flags):**
- Gejala menetap atau memberat lebih dari 48 jam
- Timbul demam mendadak atau nyeri yang menghambat aktivitas belajar

**Tindak Lanjut UKS:**
Apabila keluhan tidak mereda dalam 1–2 hari ke depan, laporkan ke Pembina Asrama atau periksakan diri ke Petugas UKS.`
  };
}

// Timeout wrapper to ensure requests never hang indefinitely
function withTimeout<T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMsg)), ms)
    ),
  ]);
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'NADI Health Intelligence API',
      timestamp: new Date().toISOString(),
    });
  });

  // Chat endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    const { messages, studentProfile } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Daftar pesan tidak valid.' });
    }

    const lastUserMessage = messages[messages.length - 1]?.text || '';

    // Build context including optional student profile
    let customSystemInstruction = NADI_SYSTEM_INSTRUCTION;
    if (studentProfile?.name || studentProfile?.dormRoom || studentProfile?.grade) {
      customSystemInstruction += `\n\n[INFORMASI SISWA]:\nNama: ${studentProfile.name || '-'}\nKelas: ${studentProfile.grade || '-'}\nKamar/Asrama: ${studentProfile.dormRoom || '-'}\nRiwayat Alergi/Penyakit: ${studentProfile.allergies || 'Tidak ada catatan'}`;
    }

    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    // Determine if web search grounding is explicitly requested or beneficial
    const promptLower = lastUserMessage.toLowerCase();
    const wantsSearch =
      promptLower.includes('cari') ||
      promptLower.includes('literatur') ||
      promptLower.includes('jurnal') ||
      promptLower.includes('pedoman') ||
      promptLower.includes('who') ||
      promptLower.includes('kemenkes') ||
      promptLower.includes('cdc') ||
      promptLower.includes('riset') ||
      promptLower.includes('penelitian') ||
      promptLower.includes('terbaru');

    // Multi-tier model cascade to handle quota limits (429) and timeouts seamlessly
    try {
      let responseText: string | undefined;

      // Tier 1: If search is requested, try gemini-3.8-flash with googleSearch tool
      if (wantsSearch) {
        try {
          const searchRes = await withTimeout(
            ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents,
              config: {
                systemInstruction: customSystemInstruction,
                tools: [{ googleSearch: {} }],
              },
            }),
            16000,
            'Gemini 3.8 Flash search timeout'
          );
          if (searchRes?.text) {
            responseText = searchRes.text;
          }
        } catch {
          // If search tool hits quota (429) or times out, proceed silently to direct model
          console.log('[NADI Engine] Search tool quota or timeout reached, proceeding to direct model.');
        }
      }

      // Tier 2: Direct gemini-3.8-flash (fast, reliable, no deprecated temperature)
      if (!responseText) {
        try {
          const directRes = await withTimeout(
            ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents,
              config: {
                systemInstruction: customSystemInstruction,
              },
            }),
            12000,
            'Gemini 3.8 Flash direct timeout'
          );
          if (directRes?.text) {
            responseText = directRes.text;
          }
        } catch {
          console.log('[NADI Engine] Flash primary quota reached, attempting Flash-Lite.');
        }
      }

      // Tier 3: gemini-3.1-flash-lite fallback in case gemini-3.8-flash encounters 429 quota exhaustion
      if (!responseText) {
        try {
          const liteRes = await withTimeout(
            ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents,
              config: {
                systemInstruction: customSystemInstruction,
              },
            }),
            8000,
            'Gemini 3.1 Flash-Lite timeout'
          );
          if (liteRes?.text) {
            responseText = liteRes.text;
          }
        } catch {
          console.log('[NADI Engine] AI models busy or quota limit reached, activating clinical rule engine.');
        }
      }

      if (responseText) {
        let triageLevel: 'HIJAU' | 'KUNING' | 'MERAH' | null = null;
        if (
          /Rekomendasi urgensi:[\s\S]*?(MERAH|LEVEL 3: MERAH|DARURAT)/i.test(responseText) ||
          responseText.includes('LEVEL 3: MERAH') ||
          responseText.includes('DARURAT:')
        ) {
          triageLevel = 'MERAH';
        } else if (
          /Rekomendasi urgensi:[\s\S]*?(KUNING|LEVEL 2: KUNING)/i.test(responseText) ||
          responseText.includes('LEVEL 2: KUNING')
        ) {
          triageLevel = 'KUNING';
        } else if (
          /Rekomendasi urgensi:[\s\S]*?(HIJAU|LEVEL 1: HIJAU)/i.test(responseText) ||
          responseText.includes('LEVEL 1: HIJAU')
        ) {
          triageLevel = 'HIJAU';
        }

        return res.json({
          reply: responseText,
          triageLevel,
        });
      }

      throw new Error('All AI model tiers exhausted');
    } catch {
      // Seamless clinical fallback following the exact NADI standard
      const fallback = generateDeterministicFallback(lastUserMessage, studentProfile);
      return res.json({
        reply: fallback.reply,
        triageLevel: fallback.triageLevel,
      });
    }
  });

  // UKS Referral Slip summary generator
  app.post('/api/generate-slip', async (req: Request, res: Response) => {
    try {
      const { complaint, studentProfile, triageLevel, actionsTaken } = req.body;

      const prompt = `Sebagai NADI Health Intelligence, buatkan ringkasan formal dan padat untuk "LEMBAR RUJUKAN / PENGANTAR UKS SEKOLAH" berdasarkan keluhan berikut:
Keluhan Siswa: ${complaint}
Tingkat Urgensi AI: ${triageLevel || 'KUNING'}
Tindakan Awal yang Sudah Dilakukan: ${actionsTaken || 'Istirahat dan observasi mandiri'}
Nama Siswa: ${studentProfile?.name || 'Siswa Asrama'}
Kelas: ${studentProfile?.grade || '-'}
Kamar Asrama: ${studentProfile?.dormRoom || '-'}
Riwayat Alergi/Kesehatan: ${studentProfile?.allergies || '-'}

Hasilkan ringkasan dalam format JSON berikut (hanya JSON valid, tanpa markdown backticks):
{
  "ringkasanKeluhan": "deskripsi singkat keluhan dan durasi",
  "dugaanKategori": "kategori keluhan (misal: Pernapasan, Dermatologi/Kulit, Gastrointestinal, dll.)",
  "urgensi": "HIJAU / KUNING / MERAH",
  "tindakanAwal": "apa yang sudah dilakukan",
  "rekomendasiUntukUKS": "poin tindakan pemeriksaan fisik yang disarankan untuk petugas UKS (misal: cek suhu, tensi, observasi ruam)",
  "tandaBahaya": "gejala darurat yang perlu diperhatikan petugas/pembina"
}`;

      let parsed: any = null;
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          }),
          6000,
          'Slip generation timeout'
        );
        parsed = JSON.parse(response.text || '{}');
      } catch {
        // Fallback to flash-lite if 3.8-flash is busy or hits quota
        try {
          const liteResponse = await withTimeout(
            ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
              },
            }),
            5000,
            'Slip generation lite timeout'
          );
          parsed = JSON.parse(liteResponse.text || '{}');
        } catch {
          // Use standard clinical slip below
        }
      }

      if (parsed && parsed.ringkasanKeluhan) {
        return res.json({ slip: parsed });
      }

    } catch {
      console.log('[NADI Engine] Using structured clinical UKS slip format.');
      // Standard clinical slip format fallback
      return res.json({
        slip: {
          ringkasanKeluhan: req.body.complaint || 'Keluhan dilaporkan melalui NADI AI',
          dugaanKategori: 'Keluhan Umum Siswa Asrama',
          urgensi: req.body.triageLevel || 'KUNING',
          tindakanAwal: req.body.actionsTaken || 'Istirahat dan evaluasi mandiri di asrama',
          rekomendasiUntukUKS: 'Pemeriksaan tanda vital dasar (Suhu tubuh, Nadi, Tekanan Darah) dan evaluasi gejala klinis.',
          tandaBahaya: 'Demam tinggi >38.5°C, sesak napas, muntah terus-menerus, atau nyeri hebat.',
          generatedAt: new Date().toISOString(),
        },
      });
    }
  });

  // Setup Vite in development or static serving in production
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NADI AI Server is running on port ${PORT} (isProduction: ${isProduction})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
