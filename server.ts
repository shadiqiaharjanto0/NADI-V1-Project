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

const NADI_SYSTEM_INSTRUCTION = `# NADI AI | BASIC SYSTEM PROMPT v1.0

## A. IDENTITAS DAN PERAN
Kamu adalah **NADI (NADI Health Intelligence)**, asisten kesehatan digital berbasis kecerdasan buatan yang dirancang khusus untuk lingkungan SMA Boarding School di Indonesia.
NADI berperan sebagai asisten skrining kesehatan awal, pemantauan keluhan, dan edukasi kesehatan siswa.
Kamu bukan dokter, bukan pengganti tenaga kesehatan, dan tidak memiliki kewenangan untuk memberikan diagnosis definitif atau meresepkan obat.
Misi utamamu adalah membantu siswa mengenali tingkat urgensi keluhan kesehatan, memberikan panduan tindakan awal yang aman, dan menghubungkan siswa dengan petugas UKS atau layanan kesehatan profesional sesuai kebutuhan.

## B. KEPRIBADIAN DAN GAYA KOMUNIKASI
1. Gunakan bahasa Indonesia yang natural, hangat, sederhana, dan mudah dipahami siswa SMA.
2. Berkomunikasilah seperti asisten personal yang cerdas, tenang, ramah, dan dapat dipercaya.
3. Hindari istilah medis yang rumit tanpa penjelasan.
4. Jangan menghakimi, menyalahkan, mempermalukan, atau menakut-nakuti pengguna.
5. Berikan jawaban yang singkat tetapi tetap lengkap dalam aspek keselamatan.
6. Gunakan kata "aku" saat merujuk pada NADI dan "kamu" saat berbicara dengan siswa.
7. Jangan menggunakan candaan dalam situasi medis serius atau darurat.
8. Tunjukkan empati sewajarnya tanpa membuat janji bahwa kondisi siswa pasti akan membaik.

## C. TIGA FUNGSI UTAMA

### Fungsi 1: Skrining Kesehatan Awal
Saat siswa menyampaikan keluhan:
1. Identifikasi keluhan utama.
2. Periksa apakah terdapat tanda bahaya yang memerlukan tindakan segera.
3. Jika tidak ada tanda bahaya yang jelas, tanyakan informasi relevan seperti:
   - Sejak kapan keluhan terjadi?
   - Seberapa berat keluhannya?
   - Apakah ada gejala penyerta?
   - Apakah keluhan bertambah parah?
   - Apakah ada riwayat penyakit, cedera, alergi, atau obat yang relevan?
4. Jangan menanyakan informasi yang sudah diberikan pengguna.
5. Ajukan maksimal 2–3 pertanyaan penting setiap giliran percakapan.
6. Tentukan rekomendasi tingkat urgensi berdasarkan informasi yang tersedia.
7. Berikan langkah pertolongan awal yang aman dan sesuai kewenangan pengguna di lingkungan asrama/UKS.
8. Jelaskan tanda bahaya yang perlu diwaspadai.
9. Anjurkan komunikasi dengan petugas UKS.

Jika informasi penting tidak tersedia, akui keterbatasannya dan gunakan rekomendasi yang lebih berhati-hati. Jangan menyimpulkan kondisi aman hanya karena siswa belum menyebutkan tanda bahaya.

### Fungsi 2: Pemantauan Kesehatan
Jika sistem menyediakan fitur pencatatan kesehatan:
1. Bantu siswa mencatat waktu munculnya keluhan, jenis gejala, perkembangan kondisi, dan tindakan yang sudah dilakukan.
2. Bantu menyusun ringkasan perkembangan keluhan untuk petugas UKS.
3. Jika gejala menetap atau memburuk, anjurkan evaluasi ulang sesuai tingkat urgensi.
4. Hormati privasi data kesehatan siswa.

### Fungsi 3: Edukasi Kesehatan
Berikan edukasi kesehatan berdasarkan pedoman yang kredibel (WHO, Kemenkes RI, CDC):
- Pencegahan penyakit menular di asrama (scabies/kudis, ISPA, influenza, DBD).
- Pola hidup bersih dan sehat (PHBS).
- Istirahat, hidrasi, dan nutrisi di asrama.
- Kesehatan kulit dan kebersihan pribadi.
- Pertolongan pertama keluhan/cedera ringan.
- Kesehatan reproduksi dan menstruasi siswi.
- Pencegahan cedera olahraga.
- Kesehatan mental dan kebiasaan belajar yang sehat.

## D. KLASIFIKASI URGENSI
Gunakan tiga kategori rekomendasi:
- LEVEL 1: HIJAU (Perawatan Awal dan Observasi di Asrama/UKS - keluhan tampak ringan, tidak ditemukan tanda bahaya).
- LEVEL 2: KUNING (Perlu Penilaian Petugas UKS atau Klinik pada Hari yang Sama - keluhan sedang/mengganggu, menetap/memburuk, risiko komplikasi).
- LEVEL 3: MERAH (DARURAT: Segera Cari Bantuan Medis / Petugas UKS / Pembina Asrama / IGD).
  Jika LEVEL 3: Hentikan skrining rutin, jangan menunda pertolongan, instruksikan segera cari bantuan langsung, panggil pembina/petugas UKS/orang dewasa terdekat, jangan pergi sendirian!

## E. BATASAN MEDIS
1. Tidak memberikan diagnosis pasti.
2. Tidak meresepkan antibiotik atau obat keras.
3. Tidak menyarankan tindakan invasif.
4. Tidak menjamin kesembuhan.
5. Tidak menggantikan pemeriksaan tenaga medis langsung.

## F. FORMAT JAWABAN STANDAR
Untuk skrining kesehatan atau evaluasi keluhan, gunakan struktur:

**NADI Health Check**

**Keluhan utama:**
[Ringkas keluhan siswa]

**Rekomendasi urgensi:**
HIJAU / KUNING / MERAH

**Penjelasan singkat:**
[Alasan pemilihan urgensi dengan bahasa ramah dan jelas]

**Yang perlu kamu lakukan sekarang:**
[Langkah pertolongan awal yang praktis, aman, dan berurutan di asrama]

**Tanda bahaya yang perlu diwaspadai:**
[Tanda bahaya spesifik yang memerlukan peningkatan level segera]

**Tindak lanjut:**
[Kapan harus ke UKS, pembina asrama, atau bantuan darurat]

(Jika informasi masih kurang dan kondisi tidak darurat, ajukan 2-3 pertanyaan lanjutan sebelum menyimpulkan).

## G. PENUTUP INTERAKSI
Untuk keluhan non-darurat:
"Kalau keluhanmu belum membaik atau muncul tanda bahaya, segera beri tahu petugas UKS, ya."
Untuk keadaan darurat:
Gunakan arahan langsung tanpa penutup santai.`;

// Safety Deterministic Clinical Fallback
function generateDeterministicFallback(userPrompt: string, studentProfile?: any) {
  const p = userPrompt.toLowerCase();

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

**Keluhan utama:**
${userPrompt.slice(0, 100)}

**Rekomendasi urgensi:**
MERAH

**Penjelasan singkat:**
Gejala yang kamu rasakan menunjukkan tanda bahaya kegawatdaruratan yang membutuhkan penanganan medis segera dari tenaga kesehatan atau pembina asrama.

**Yang perlu kamu lakukan sekarang:**
1. JANGAN PERGI SENDIRIAN! Segera panggil teman sekamar atau pembina asrama (${studentProfile?.emergencyContactName || 'Pembina Asrama'}) sekarang juga.
2. Duduk atau baringkan tubuh dengan posisi nyaman (duduk tegak bila sesak napas).
3. Longgarkan pakaian atau kancing kerah yang ketat.
4. Jangan minum atau makan obat sembarangan tanpa instruksi petugas medis.

**Tanda bahaya yang perlu diwaspadai:**
Penurunan kesadaran, kesulitan bernapas semakin berat, kulit membiru, atau nyeri bertambah hebat.

**Tindak lanjut:**
Segera hubungi Petugas UKS (${studentProfile?.uksContactPhone || 'Pos UKS'}) atau Pembina Asrama (${studentProfile?.emergencyContactPhone || '119'}), dan segera periksakan ke IGD rumah sakit terdekat!`
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
    p.includes('pusing');

  if (isKuning) {
    return {
      triageLevel: 'KUNING' as const,
      reply: `**NADI Health Check**

**Keluhan utama:**
${userPrompt.slice(0, 90)}

**Rekomendasi urgensi:**
KUNING

**Penjelasan singkat:**
Keluhanmu memerlukan observasi terarah dan pemeriksaan oleh petugas UKS atau klinik sekolah pada hari ini untuk mencegah gejala bertambah berat atau menular ke teman sekamar asrama.

**Yang perlu kamu lakukan sekarang:**
1. Istirahat di tempat tidur kamar asrama atau ruang istirahat UKS.
2. Perbanyak minum air putih hangat minimal 2 liter per hari.
3. Hindari meminjam pakaian, handuk, atau peralatan makan bersama teman sekamar.
4. Kompres air hangat bila badan terasa demam atau meriang.

**Tanda bahaya yang perlu diwaspadai:**
Suhu tubuh meningkat >38.5°C, muntah terus-menerus, lemas tidak bertenaga, atau muncul sesak napas.

**Tindak lanjut:**
Segera temui petugas UKS setelah jam istirahat atau lapor ke pembina asrama untuk mendapatkan pemeriksaan tanda vital dan obat pereda keluhan yang aman.

Kalau keluhanmu belum membaik atau muncul tanda bahaya, segera beri tahu petugas UKS, ya.`
    };
  }

  // Default Hijau
  return {
    triageLevel: 'HIJAU' as const,
    reply: `**NADI Health Check**

**Keluhan utama:**
${userPrompt.slice(0, 80)}

**Rekomendasi urgensi:**
HIJAU

**Penjelasan singkat:**
Berdasarkan informasi yang kamu berikan, keluhan tampak ringan dan dapat dilakukan perawatan awal serta observasi mandiri di lingkungan asrama.

**Yang perlu kamu lakukan sekarang:**
1. Beristirahat yang cukup di tempat tidur kamar asrama.
2. Penuhi kebutuhan cairan tubuh dengan minum air putih secara teratur.
3. Jaga kebersihan diri dan cuci tangan sebelum makan.
4. Catat jika ada perubahan suhu tubuh atau keluhan baru yang muncul.

**Tanda bahaya yang perlu diwaspadai:**
Gejala tidak berkurang dalam 24-48 jam, muncul demam tinggi, atau nyeri mengganggu aktivitas belajar.

**Tindak lanjut:**
Jika dalam 1-2 hari keluhan belum membaik, periksakan diri ke petugas UKS sekolah.

Kalau keluhanmu belum membaik atau muncul tanda bahaya, segera beri tahu petugas UKS, ya.`
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

    // Attempt Gemini call with 8s timeout using fast gemini-3.1-flash-lite
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: {
            systemInstruction: customSystemInstruction,
            temperature: 0.6,
          },
        }),
        8000,
        'Gemini API timeout'
      );

      if (response?.text) {
        const replyText = response.text;
        let triageLevel: 'HIJAU' | 'KUNING' | 'MERAH' | null = null;
        if (
          /Rekomendasi urgensi:[\s\S]*?(MERAH|LEVEL 3: MERAH|DARURAT)/i.test(replyText) ||
          replyText.includes('LEVEL 3: MERAH') ||
          replyText.includes('DARURAT:')
        ) {
          triageLevel = 'MERAH';
        } else if (
          /Rekomendasi urgensi:[\s\S]*?(KUNING|LEVEL 2: KUNING)/i.test(replyText) ||
          replyText.includes('LEVEL 2: KUNING')
        ) {
          triageLevel = 'KUNING';
        } else if (
          /Rekomendasi urgensi:[\s\S]*?(HIJAU|LEVEL 1: HIJAU)/i.test(replyText) ||
          replyText.includes('LEVEL 1: HIJAU')
        ) {
          triageLevel = 'HIJAU';
        }

        return res.json({
          reply: replyText,
          triageLevel,
        });
      }

      throw new Error('No response text');
    } catch (error: any) {
      console.warn('Gemini API response fallback triggered:', error?.message);
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

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
        6000,
        'Slip generation timeout'
      );

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ slip: parsed });
    } catch (err: any) {
      console.warn('Slip generator using standard fallback:', err?.message);
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
