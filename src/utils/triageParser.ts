import { TriageUrgency } from '../types';

export interface StructuredHealthCheck {
  keluhanUtama: string;
  urgensi: TriageUrgency;
  penjelasan: string;
  tindakanSekarang: string[];
  tandaBahaya: string[];
  tindakLanjut: string;
}

export function parseHealthCheckResponse(text: string): StructuredHealthCheck | null {
  if (!text) return null;

  // Check if text indicates NADI Health Check or has urgensi markers
  const isHealthCheck =
    /NADI Health Check/i.test(text) ||
    /Rekomendasi urgensi/i.test(text) ||
    /Yang perlu kamu lakukan sekarang/i.test(text);

  if (!isHealthCheck) return null;

  // Extract Urgensi
  let urgensi: TriageUrgency = 'KUNING';
  if (/Rekomendasi urgensi:[\s\S]*?(MERAH|LEVEL 3: MERAH|DARURAT)/i.test(text) || /Urgensi:[\s\S]*?MERAH/i.test(text)) {
    urgensi = 'MERAH';
  } else if (/Rekomendasi urgensi:[\s\S]*?(HIJAU|LEVEL 1: HIJAU)/i.test(text) || /Urgensi:[\s\S]*?HIJAU/i.test(text)) {
    urgensi = 'HIJAU';
  } else if (/Rekomendasi urgensi:[\s\S]*?(KUNING|LEVEL 2: KUNING)/i.test(text) || /Urgensi:[\s\S]*?KUNING/i.test(text)) {
    urgensi = 'KUNING';
  }

  // Extract Keluhan Utama
  const keluhanMatch = text.match(/Keluhan utama:?\s*([\s\S]*?)(?=\*\*Rekomendasi urgensi|\*\*Penjelasan|\n\n\*\*|$)/i);
  const keluhanUtama = keluhanMatch
    ? keluhanMatch[1].replace(/^\*\*|\*\*$/g, '').trim()
    : 'Keluhan kesehatan siswa';

  // Extract Penjelasan Singkat
  const penjelasanMatch = text.match(/Penjelasan singkat:?\s*([\s\S]*?)(?=\*\*Yang perlu kamu lakukan|\*\*Tindakan|\n\n\*\*|$)/i);
  const penjelasan = penjelasanMatch
    ? penjelasanMatch[1].replace(/^\*\*|\*\*$/g, '').trim()
    : '';

  // Extract Yang perlu kamu lakukan sekarang
  const tindakanMatch = text.match(/Yang perlu kamu lakukan sekarang:?\s*([\s\S]*?)(?=\*\*Tanda bahaya|\n\n\*\*|$)/i);
  let tindakanSekarang: string[] = [];
  if (tindakanMatch) {
    tindakanSekarang = tindakanMatch[1]
      .split('\n')
      .map(line => line.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(line => line.length > 0);
  }

  // Extract Tanda bahaya
  const bahayaMatch = text.match(/Tanda bahaya yang perlu diwaspadai:?\s*([\s\S]*?)(?=\*\*Tindak lanjut|\n\n\*\*|$)/i);
  let tandaBahaya: string[] = [];
  if (bahayaMatch) {
    tandaBahaya = bahayaMatch[1]
      .split('\n')
      .map(line => line.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(line => line.length > 0);
  }

  // Extract Tindak lanjut
  const tindakLanjutMatch = text.match(/Tindak lanjut:?\s*([\s\S]*?)(?=\n\n\*\*|Kalau keluhanmu|$)/i);
  const tindakLanjut = tindakLanjutMatch
    ? tindakLanjutMatch[1].replace(/^\*\*|\*\*$/g, '').trim()
    : '';

  return {
    keluhanUtama,
    urgensi,
    penjelasan,
    tindakanSekarang: tindakanSekarang.length > 0 ? tindakanSekarang : ['Istirahat cukup di asrama/UKS', 'Pantau perkembangan gejala'],
    tandaBahaya: tandaBahaya.length > 0 ? tandaBahaya : ['Gejala bertambah parah dalam 24 jam', 'Demam tinggi mendadak'],
    tindakLanjut: tindakLanjut || 'Hubungi petugas UKS atau pembina asrama jika keluhan tidak membaik.'
  };
}
