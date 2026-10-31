import { TriageUrgency, StudentProfile } from '../types';

export function getOfflineTriageFallback(userPrompt: string, profile: StudentProfile): {
  reply: string;
  triageLevel: TriageUrgency;
} {
  const p = userPrompt.toLowerCase();

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

**Keluhan utama:**
${userPrompt.slice(0, 100)}

**Rekomendasi urgensi:**
MERAH

**Penjelasan singkat:**
Keluhan yang kamu sampaikan menunjukkan adanya tanda bahaya kegawatdaruratan yang membutuhkan penanganan medis segera dari orang dewasa atau tenaga kesehatan.

**Yang perlu kamu lakukan sekarang:**
1. JANGAN PERGI SENDIRIAN! Segera panggil teman sekamar atau pembina asrama (${profile.emergencyContactName}) sekarang juga.
2. Duduk atau baringkan tubuh dengan posisi rileks (duduk tegak bila sesak napas).
3. Longgarkan kancing kerah baju dan pastikan sirkulasi udara kamar asrama lancar.
4. Jangan mengonsumsi obat keras sembarangan tanpa instruksi dokter.

**Tanda bahaya yang perlu diwaspadai:**
Kesulitan bernapas bertambah berat, penurunan kesadaran, kejang, atau bibir tampak kebiruan.

**Tindak lanjut:**
Segera hubungi Petugas UKS (${profile.uksContactPhone}) atau Pembina Asrama (${profile.emergencyContactPhone}), dan segera evakuasi ke fasilitas kesehatan / IGD terdekat!`,
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

**Keluhan utama:**
${userPrompt.slice(0, 100)}

**Rekomendasi urgensi:**
KUNING

**Penjelasan singkat:**
Keluhanmu memerlukan observasi terarah dan pemeriksaan oleh petugas UKS atau klinik sekolah pada hari ini agar gejala tidak bertambah parah atau menular ke teman sekamar asrama.

**Yang perlu kamu lakukan sekarang:**
1. Istirahat di tempat tidur kamar asrama atau ruang istirahat UKS.
2. Perbanyak minum air putih hangat minimal 2–2,5 liter per hari.
3. Hindari meminjam pakaian, handuk, atau peralatan makan bersama teman sekamar.
4. Kompres air hangat bila badan terasa demam atau meriang.

**Tanda bahaya yang perlu diwaspadai:**
Suhu tubuh meningkat >38.5°C, muntah terus-menerus, tubuh sangat lemas, atau muncul sesak napas.

**Tindak lanjut:**
Segera temui petugas UKS di ruang kesehatan sekolah atau lapor ke pembina asrama untuk mendapatkan pemeriksaan fisik dan obat pereda keluhan yang aman.

Kalau keluhanmu belum membaik atau muncul tanda bahaya, segera beri tahu petugas UKS, ya.`,
    };
  }

  // Mild / Green
  return {
    triageLevel: 'HIJAU',
    reply: `**NADI Health Check**

**Keluhan utama:**
${userPrompt.slice(0, 100)}

**Rekomendasi urgensi:**
HIJAU

**Penjelasan singkat:**
Berdasarkan keluhan yang kamu sampaikan, kondisi tampak ringan dan aman untuk dilakukan perawatan mandiri serta observasi awal di lingkungan asrama.

**Yang perlu kamu lakukan sekarang:**
1. Beristirahat yang cukup di kasur asrama dan hindari begadang.
2. Cukupi kebutuhan cairan dengan rutin minum air putih.
3. Jaga kebersihan diri, cuci tangan dengan sabun, dan konsumsi makanan bergizi di kantin.
4. Catat jika ada perubahan suhu tubuh atau keluhan baru yang dirasakan.

**Tanda bahaya yang perlu diwaspadai:**
Gejala tidak berkurang dalam 24–48 jam, muncul demam tinggi, atau keluhan mulai mengganggu kegiatan belajar sekolah.

**Tindak lanjut:**
Jika dalam 1–2 hari keluhan belum membaik, silakan berkunjung ke ruang UKS sekolah untuk diperiksa lebih lanjut oleh petugas.

Kalau keluhanmu belum membaik atau muncul tanda bahaya, segera beri tahu petugas UKS, ya.`,
  };
}
