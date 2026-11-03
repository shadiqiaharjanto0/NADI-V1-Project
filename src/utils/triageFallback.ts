import { TriageUrgency, StudentProfile } from '../types';

export function getOfflineTriageFallback(userPrompt: string, profile: StudentProfile): {
  reply: string;
  triageLevel: TriageUrgency | null;
} {
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

    if (p.includes('mimisan') || p.includes('darah hidung')) {
      return {
        triageLevel: null,
        reply: `**Panduan Pertolongan Pertama Mimisan (Epistaksis) di Asrama:**

**Langkah-langkah Penanganan Cepat:**
1. **Duduk Tegak dan Condongkan Tubuh ke Depan:** Jangan mendongakkan kepala ke belakang! Mendongak dapat menyebabkan darah mengalir ke tenggorokan dan tertelan ke lambung, memicu mual, muntah, atau tersedak.
2. **Jepit Cuping Hidung:** Gunakan ibu jari dan jari telunjuk untuk menjepit erat bagian lunak hidung (tepat di bawah tulang hidung) selama 10–15 menit penuh tanpa dilepas. Bernapaslah melalui mulut.
3. **Kompres Dingin:** Letakkan kompres es atau kain dingin di pangkal hidung dan dahi untuk membantu menyempitkan pembuluh darah (*vasokonstriksi*).
4. **Setelah Darah Berhenti:** Jangan mengorek hidung, menghembuskan napas kuat, atau membungkuk selama beberapa jam ke depan agar bekuan darah tidak lepas kembali.

**Kapan Harus Segera ke UKS / Rumah Sakit?**
- Perdarahan tidak berhenti setelah ditekan selama 20 menit terus-menerus.
- Mimisan terjadi akibat benturan keras di kepala/wajah.
- Siswa merasa pusing berputar, lemas ekstrem, atau kulit tampak pucat pasi.`
      };
    }

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

Segera panggil **Pembina Asrama** (${profile.emergencyContactName}) dan **Petugas UKS** sekarang juga untuk evaluasi tanda vital.`
      };
    }

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
- Paracetamol aman dikonsumsi sebelum atau sesudah makan (tidak mengiritasi lambung seperti obat antiinflamasi non-steroid).

**3. Kapan Harus ke UKS?**
- Suhu tubuh mencapai >38.5°C dan tidak turun setelah minum obat.
- Demam menetap lebih dari 3 hari.
- Disertai tanda bahaya seperti menggigil hebat, leher sangat kaku, kejang, atau muntah berulang.`
      };
    }

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

  // Emergency Red Flags
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
      triageLevel: 'MERAH',
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
Segera panggil Pembina Asrama (${profile.emergencyContactName}), Petugas UKS (${profile.uksContactPhone}), dan lakukan rujukan ambulans / IGD terdekat (119/112).`,
    };
  }

  // Moderate / Yellow Flags
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
    p.includes('migrain');

  if (isKuning) {
    return {
      triageLevel: 'KUNING',
      reply: `**NADI Health Check**

**Keluhan Utama:**
${userPrompt.slice(0, 100)}

**Rekomendasi Urgensi:**
LEVEL 2: KUNING (Pemeriksaan Pos UKS Hari Ini)

**Penalaran Klinis:**
Keluhan menunjukkan proses patologis aktif (dugaan infeksi droplet/kontak, inflamasi mukosa lambung, atau cedera ligamen) dengan risiko transmisi antar siswa di kamar asrama atau perburukan tanpa evaluasi klinis.

**Tindakan Keselamatan Siswa:**
1. Batasi aktivitas fisik berat dan istirahatkan tubuh di kasur kamar asrama atau ruang observasi UKS.
2. Tingkatkan hidrasi cairan elektrolit atau air hangat 2 hingga 2,5 liter per hari untuk menjaga perfusi organ.
3. Pisahkan perlengkapan pribadi (handuk, pakaian, sprei) dari teman sekamar guna memutus rantai transmisi.
4. Lakukan kompres air hangat (bukan es) jika terdapat demam atau meriang.

**Tanda Bahaya (Red Flags):**
- Suhu tubuh mencapai >38.5°C atau menggigil hebat
- Muntah berulang hingga tidak mampu menelan cairan
- Nyeri abdomen hebat yang menetap

**Tindak Lanjut UKS:**
Datang ke Pos UKS pada jam operasional hari ini untuk pemeriksaan tanda vital (suhu, nadi, tensi) dan pencatatan rekam medis terpadu.`,
    };
  }

  // Mild / Green
  return {
    triageLevel: 'HIJAU',
    reply: `**NADI Health Check**

**Keluhan Utama:**
${userPrompt.slice(0, 100)}

**Rekomendasi Urgensi:**
LEVEL 1: HIJAU (Observasi Mandiri & Perawatan Dasar)

**Penalaran Klinis:**
Analisis klinis menunjukkan keluhan bersifat fungsional/ringan (*self-limiting*) tanpa keterlibatan tanda bahaya sistemik, sehingga aman diobservasi secara mandiri di kamar asrama.

**Tindakan Keselamatan Siswa:**
1. Istirahat berbaring teratur minimal 7–8 jam dan kurangi pajanan layar gawai.
2. Cukupi asupan cairan dengan minum air putih minimal 8 gelas per hari.
3. Konsumsi makanan bergizi dari kantin/asrama secara teratur dan hindari konsumsi makanan terlampau pedas/asam.
4. Catat mandiri perkembangan keluhan di Buku Catatan Kesehatan NADI.

**Tanda Bahaya (Red Flags):**
- Gejala menetap atau memberat lebih dari 48 jam
- Timbul demam mendadak atau nyeri yang menghambat aktivitas belajar

**Tindak Lanjut UKS:**
Apabila keluhan tidak mereda dalam 1–2 hari ke depan, laporkan ke Pembina Asrama atau periksakan diri ke Petugas UKS.`,
  };
}
