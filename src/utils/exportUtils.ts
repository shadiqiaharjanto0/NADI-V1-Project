import * as XLSX from 'xlsx';
import { HealthRecord, StudentProfile } from '../types';

/**
 * Export scoped strictly to student's personal health records
 */
export function exportSiswaPersonalXLSX(studentProfile: StudentProfile, records: HealthRecord[]) {
  // Scoped strictly to student's records
  const personalRecords = records.filter(
    (r) => !r.studentName || r.studentName === studentProfile.name || r.studentId === 'user-siswa-1'
  );

  // Sheet 1: Profil & Informasi Medis Siswa
  const profileData = [
    { Label: 'Nama Lengkap Siswa', Nilai: studentProfile.name },
    { Label: 'Rombel / Kelas', Nilai: studentProfile.grade },
    { Label: 'Gedung Asrama', Nilai: studentProfile.dormBuilding },
    { Label: 'Nomor Kamar', Nilai: studentProfile.dormRoom },
    { Label: 'Jenis Kelamin', Nilai: studentProfile.gender },
    { Label: 'Golongan Darah', Nilai: studentProfile.bloodType || 'Belum Tercatat' },
    { Label: 'Riwayat Alergi / Kondisi Khusus', Nilai: studentProfile.allergies },
    { Label: 'Pembina Asrama Pendamping', Nilai: studentProfile.emergencyContactName },
    { Label: 'Kontak Darurat Pembina', Nilai: studentProfile.emergencyContactPhone },
    { Label: 'Kontak Pos Medis UKS', Nilai: studentProfile.uksContactPhone },
    { Label: 'Tanggal Ekspor Data', Nilai: new Date().toLocaleString('id-ID') },
  ];

  // Sheet 2: Riwayat Keluhan & Rekam Medis Pribadi
  const recordsData = personalRecords.map((r, index) => {
    return {
      'No': index + 1,
      'Tanggal & Waktu': new Date(r.timestamp).toLocaleString('id-ID'),
      'Keluhan Utama': r.complaintTitle,
      'Rincian Keluhan': r.complaintDetails,
      'Tingkat Urgensi (Triase)': r.triageLevel,
      'Durasi Gejala': r.duration,
      'Suhu Tubuh': r.vitalSigns?.temperature || '-',
      'Tekanan Darah': r.vitalSigns?.bloodPressure || '-',
      'Denyut Nadi': r.vitalSigns?.pulse || '-',
      'Saturasi SpO2': r.vitalSigns?.spO2 || '-',
      'Tindakan Awal Asrama': r.actionsTaken,
      'Terapi Obat UKS': r.medicationsGiven?.join(', ') || '-',
      'Izin Istirahat / Dispensasi': r.dispensationApproved ? `Disetujui (${r.dispensationDays || 1} hari)` : 'Tidak Ada',
      'Status Pemulihan': r.status,
      'Catatan Petugas': r.clinicalNotes || (r.updates.length > 0 ? r.updates[r.updates.length - 1].note : '-'),
    };
  });

  const wb = XLSX.utils.book_new();

  const wsProfile = XLSX.utils.json_to_sheet(profileData);
  const wsRecords = XLSX.utils.json_to_sheet(recordsData);

  // Auto-width adjustment for columns
  wsProfile['!cols'] = [{ wch: 30 }, { wch: 50 }];
  wsRecords['!cols'] = [
    { wch: 6 },
    { wch: 22 },
    { wch: 32 },
    { wch: 40 },
    { wch: 16 },
    { wch: 14 },
    { wch: 12 },
    { wch: 14 },
    { wch: 12 },
    { wch: 12 },
    { wch: 30 },
    { wch: 25 },
    { wch: 18 },
    { wch: 18 },
    { wch: 35 },
  ];

  XLSX.utils.book_append_sheet(wb, wsProfile, 'Profil Kesehatan');
  XLSX.utils.book_append_sheet(wb, wsRecords, 'Buku Rekap Siswa');

  const safeName = studentProfile.name.replace(/[^a-zA-Z0-9]/g, '_');
  XLSX.writeFile(wb, `Rekap_Kesehatan_Pribadi_${safeName}.xlsx`);
}

/**
 * Export for Pembina Asrama: Dormitory Health & Bed Rest Registry
 */
export function exportPembinaAsramaXLSX(records: HealthRecord[], filterDorm: string, filterClass: string) {
  const filtered = records.filter((r) => {
    const matchesDorm = filterDorm === 'Semua' || r.dormBuilding === filterDorm;
    const matchesClass = filterClass === 'Semua' || (r.grade && r.grade.startsWith(filterClass));
    return matchesDorm && matchesClass;
  });

  const dataRows = filtered.map((r, index) => {
    return {
      'No': index + 1,
      'Tanggal Lapor': new Date(r.timestamp).toLocaleString('id-ID'),
      'Nama Siswa/Siswi': r.studentName || 'Siswa',
      'Kelas / Rombel': r.grade || '-',
      'Gedung Asrama': r.dormBuilding || '-',
      'Nomor Kamar': r.dormRoom || '-',
      'Keluhan Utama': r.complaintTitle,
      'Tingkat Urgensi': r.triageLevel,
      'Suhu Terakhir': r.vitalSigns?.temperature || '-',
      'Status Kamar': r.status,
      'Dispensasi KBM (Izin Sakit)': r.dispensationApproved ? 'DISETUJUI' : 'TIDAK',
      'Lama Dispensasi': r.dispensationDays ? `${r.dispensationDays} Hari` : '-',
      'Tindakan Pembina / Asrama': r.actionsTaken,
      'Catatan Pantauan Pembina': r.updates
        .filter((u) => u.authorRole === 'pembina')
        .map((u) => u.note)
        .join('; ') || '-',
    };
  });

  // Aggregated Summary by Room for Cluster detection
  const roomCounts: Record<string, { total: number; active: number; dorm: string }> = {};
  filtered.forEach((r) => {
    const rm = r.dormRoom || 'Kamar Tidak Tercatat';
    if (!roomCounts[rm]) {
      roomCounts[rm] = { total: 0, active: 0, dorm: r.dormBuilding || '-' };
    }
    roomCounts[rm].total += 1;
    if (r.status !== 'Selesai') {
      roomCounts[rm].active += 1;
    }
  });

  const summaryRows = Object.entries(roomCounts).map(([room, stat], idx) => ({
    'No': idx + 1,
    'Nomor Kamar': room,
    'Gedung Asrama': stat.dorm,
    'Total Kasus Tercatat': stat.total,
    'Kasus Aktif Saat Ini': stat.active,
    'Status Klaster Kamar': stat.active >= 2 ? 'PERINGATAN KLASTER (≥2 Siswa/Siswi)' : 'Normal',
  }));

  const wb = XLSX.utils.book_new();

  const wsMain = XLSX.utils.json_to_sheet(dataRows);
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);

  wsMain['!cols'] = [
    { wch: 6 },
    { wch: 20 },
    { wch: 28 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
    { wch: 32 },
    { wch: 16 },
    { wch: 14 },
    { wch: 18 },
    { wch: 20 },
    { wch: 16 },
    { wch: 30 },
    { wch: 35 },
  ];

  wsSummary['!cols'] = [
    { wch: 6 },
    { wch: 22 },
    { wch: 16 },
    { wch: 18 },
    { wch: 18 },
    { wch: 32 },
  ];

  XLSX.utils.book_append_sheet(wb, wsMain, 'Rekap Pantauan Asrama');
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Sebaran Kamar');

  const safeDorm = filterDorm.replace(/[^a-zA-Z0-9]/g, '_');
  XLSX.writeFile(wb, `Rekap_Kesehatan_Asrama_${safeDorm}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Export for Tenaga Medis: Full UKS Clinical Visit Registry & Pharmacy Usage
 */
export function exportUksClinicalXLSX(records: HealthRecord[]) {
  const visitRows = records.map((r, index) => {
    return {
      'No. Reg': `REG-${String(index + 1).padStart(4, '0')}`,
      'Waktu Kunjungan': new Date(r.timestamp).toLocaleString('id-ID'),
      'Nama Pasien': r.studentName || 'Siswa',
      'Kelas / Rombel': r.grade || '-',
      'Asrama & Kamar': `${r.dormBuilding || '-'} • ${r.dormRoom || '-'}`,
      'Triase NADI': r.triageLevel,
      'Keluhan / Anamnesa': r.complaintTitle,
      'Rincian Klinis': r.complaintDetails,
      'Suhu (°C)': r.vitalSigns?.temperature || '-',
      'Tekanan Darah (mmHg)': r.vitalSigns?.bloodPressure || '-',
      'Denyut Nadi (bpm)': r.vitalSigns?.pulse || '-',
      'Saturasi SpO2 (%)': r.vitalSigns?.spO2 || '-',
      'Tindakan Medis UKS': r.clinicalNotes || '-',
      'Terapi & Obat Diberikan': r.medicationsGiven?.join(', ') || '-',
      'Dispensasi KBM': r.dispensationApproved ? `Ya (${r.dispensationDays || 1} hari)` : 'Tidak',
      'Status Akhir Pasien': r.status,
    };
  });

  // Medication Dispensing Summary
  const medCounts: Record<string, number> = {};
  records.forEach((r) => {
    if (r.medicationsGiven) {
      r.medicationsGiven.forEach((m) => {
        medCounts[m] = (medCounts[m] || 0) + 1;
      });
    }
  });

  const medRows = Object.entries(medCounts).map(([medName, count], idx) => ({
    'No': idx + 1,
    'Nama Obat / Sediaan Farmasi UKS': medName,
    'Frekuensi Diberikan': count,
  }));

  const wb = XLSX.utils.book_new();

  const wsVisits = XLSX.utils.json_to_sheet(visitRows);
  const wsMeds = XLSX.utils.json_to_sheet(medRows);

  wsVisits['!cols'] = [
    { wch: 10 },
    { wch: 22 },
    { wch: 28 },
    { wch: 14 },
    { wch: 22 },
    { wch: 14 },
    { wch: 32 },
    { wch: 35 },
    { wch: 12 },
    { wch: 18 },
    { wch: 16 },
    { wch: 16 },
    { wch: 35 },
    { wch: 30 },
    { wch: 16 },
    { wch: 20 },
  ];

  wsMeds['!cols'] = [
    { wch: 6 },
    { wch: 40 },
    { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(wb, wsVisits, 'Register Kunjungan UKS');
  XLSX.utils.book_append_sheet(wb, wsMeds, 'Rekap Penggunaan Obat');

  XLSX.writeFile(wb, `Buku_Register_Klinik_UKS_${new Date().getFullYear()}_${new Date().toISOString().split('T')[0]}.xlsx`);
}
