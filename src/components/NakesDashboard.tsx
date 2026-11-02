import React, { useState } from 'react';
import {
  Stethoscope,
  HeartPulse,
  Thermometer,
  Activity,
  FileText,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Printer,
  Ambulance,
  BarChart3,
  Download,
  ShieldAlert,
} from 'lucide-react';
import { HealthRecord, AuthUser, UKSReferralSlip } from '../types';
import { TriageBadge } from './TriageBadge';
import { UksTrendAnalytics } from './UksTrendAnalytics';
import { exportUksClinicalXLSX } from '../utils/exportUtils';
import { FormattedText } from './FormattedText';

interface NakesDashboardProps {
  currentUser: AuthUser;
  records: HealthRecord[];
  onUpdateRecord: (
    recordId: string,
    updateNote: string,
    newStatus?: 'Aktif' | 'Membaik' | 'Selesai' | 'Dirujuk ke UKS' | 'Observasi Rawat UKS' | 'Rujuk RS',
    temperature?: string
  ) => void;
  onOpenUksSlip: (slip: UKSReferralSlip) => void;
  onConsultNadi: (promptText: string) => void;
  onEmergencyTrigger: () => void;
}

export const NakesDashboard: React.FC<NakesDashboardProps> = ({
  currentUser,
  records,
  onUpdateRecord,
  onOpenUksSlip,
  onConsultNadi,
  onEmergencyTrigger,
}) => {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(
    records[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [activeNakesTab, setActiveNakesTab] = useState<'queue' | 'analytics'>('queue');

  // Clinical Examination Form State
  const [examTemp, setExamTemp] = useState('37.5');
  const [examBP, setExamBP] = useState('110/70');
  const [examPulse, setExamPulse] = useState('80');
  const [examNotes, setExamNotes] = useState('');
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);
  const [isObservingInUKS, setIsObservingInUKS] = useState(false);
  const [dispensationDays, setDispensationDays] = useState(1);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  const selectedRecord = records.find((r) => r.id === selectedRecordId) || records[0];

  const commonMeds = [
    'Paracetamol 500mg (3x1 p.c.)',
    'Antasida Doen Tablet Kunyah',
    'Krim Permethrin 5% (Oles malam hari)',
    'Oralit Sachet (Rehidrasi)',
    'Cetirizine 10mg (Anti-alergi)',
    'Kompres Dingin / Tensocrepe (P3K Sendi)',
    'Tablet Tambah Darah (TTD Siswi)',
    'Vitamin C 500mg',
  ];

  const handleToggleMed = (med: string) => {
    setSelectedMeds((prev) =>
      prev.includes(med) ? prev.filter((m) => m !== med) : [...prev, med]
    );
  };

  const handleSaveClinicalExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const note = `[Pemeriksaan Medis UKS - ${currentUser.name}]:
• Tanda Vital: Suhu ${examTemp}°C, TD ${examBP} mmHg, Nadi ${examPulse} bpm.
• Observasi Klinis: ${examNotes || 'Pemeriksaan fisik umum dilakukan.'}
• Terapi Obat/P3K: ${selectedMeds.length > 0 ? selectedMeds.join(', ') : 'Observasi non-farmakologis & hidrasi'}.
• Tindakan: ${isObservingInUKS ? 'Observasi di Ruang Rawat UKS' : 'Istirahat kamar asrama'} (Dispensasi ${dispensationDays} hari).`;

    const newStatus = isObservingInUKS ? 'Observasi Rawat UKS' : 'Membaik';
    onUpdateRecord(selectedRecord.id, note, newStatus, `${examTemp}°C`);

    setIsExamModalOpen(false);
    setExamNotes('');
    setSelectedMeds([]);
  };

  const handleReferToHospital = (rec: HealthRecord) => {
    onUpdateRecord(
      rec.id,
      `[RUJUKAN GAWAT DARURAT]: Pasien dirujuk ke IGD RSUD / Puskesmas terdekat oleh Tenaga Medis UKS (${currentUser.name}) untuk penanganan lanjutan.`,
      'Rujuk RS'
    );
    onEmergencyTrigger();
  };

  const handleExportXlsx = () => {
    exportUksClinicalXLSX(records);
  };

  const handlePrintRegistry = () => {
    window.print();
  };

  // Cluster Detection: identify rooms with >= 2 active complaints
  const roomClusterMap: Record<string, number> = {};
  records.forEach((r) => {
    if (r.status !== 'Selesai' && r.dormRoom) {
      roomClusterMap[r.dormRoom] = (roomClusterMap[r.dormRoom] || 0) + 1;
    }
  });

  const clusterRooms = Object.entries(roomClusterMap).filter(([_, count]) => count >= 2);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      (r.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.complaintTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.dormRoom || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'Semua' ||
      (filterStatus === 'Darurat' && r.triageLevel === 'MERAH') ||
      (filterStatus === 'Rawat UKS' && r.status === 'Observasi Rawat UKS') ||
      (filterStatus === 'Rujukan' && r.status === 'Dirujuk ke UKS');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
      {/* Top Clinic Header - Apple Minimalist */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-500">
            <Stethoscope className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>Unit Kesehatan Sekolah • Pos Medis Asrama</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-800">
            Dasbor Tenaga Kesehatan UKS
          </h1>
          <p className="text-xs text-slate-500">
            Petugas Jaga: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.identifier})
          </p>
        </div>

        {/* Global Clinic Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleExportXlsx}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium border border-zinc-200 transition-colors"
            title="Ekspor Register UKS ke Spreadsheet Excel / Google Sheets"
          >
            <Download className="w-3.5 h-3.5 text-zinc-600" />
            <span>Ekspor XLSX (Sheets)</span>
          </button>

          <button
            onClick={handlePrintRegistry}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium border border-zinc-200 transition-colors"
            title="Cetak Laporan Kunjungan ke PDF"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-600" />
            <span>Cetak PDF</span>
          </button>

          <button
            onClick={onEmergencyTrigger}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
          >
            <Ambulance className="w-3.5 h-3.5" />
            <span>Protokol Darurat 119 / 112</span>
          </button>
        </div>
      </div>

      {/* Metrics Row - Tabular & Clean */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs no-print">
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <span className="text-zinc-500 block text-[11px]">Antrean Kunjungan Baru</span>
          <span className="text-xl font-semibold text-zinc-900 mt-1 block font-mono tabular-nums">
            {records.filter((r) => r.status === 'Dirujuk ke UKS').length} Siswa
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <span className="text-zinc-500 block text-[11px]">Rawat Observasi UKS</span>
          <span className="text-xl font-semibold text-zinc-900 mt-1 block font-mono tabular-nums">
            {records.filter((r) => r.status === 'Observasi Rawat UKS').length} Ranjang
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <span className="text-zinc-500 block text-[11px]">Kasus Darurat Merah</span>
          <span className="text-xl font-semibold text-red-600 mt-1 block font-mono tabular-nums">
            {records.filter((r) => r.status === 'Rujuk RS' || r.triageLevel === 'MERAH').length} Kasus
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <span className="text-zinc-500 block text-[11px]">Klaster Kamar Terdeteksi</span>
          <span className="text-xl font-semibold text-zinc-900 mt-1 block font-mono tabular-nums">
            {clusterRooms.length} Kamar
          </span>
        </div>
      </div>

      {/* Cluster Outbreak Alert Banner if detected */}
      {clusterRooms.length > 0 && (
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-950 flex items-start gap-3 no-print">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-semibold text-amber-900">
              Peringatan Dini Klaster Kesehatan Asrama:
            </p>
            <p className="leading-relaxed text-amber-900">
              Terdeteksi siswa/siswi sekamar sakit bersamaan di{' '}
              {clusterRooms.map(([room, count]) => (
                <strong key={room} className="font-semibold underline mr-2">
                  {room} ({count} siswa/siswi)
                </strong>
              ))}
              . Lakukan investigasi penularan (tungau skabies, ventilasi, sprei air panas).
            </p>
          </div>
        </div>
      )}

      {/* Tab Navigation: Queue vs Recharts Trend Analytics */}
      <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl text-xs font-medium w-fit no-print">
        <button
          onClick={() => setActiveNakesTab('queue')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeNakesTab === 'queue'
              ? 'bg-white text-zinc-900 font-semibold shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Antrean & Rekam Klinis ({filteredRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveNakesTab('analytics')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeNakesTab === 'analytics'
              ? 'bg-white text-zinc-900 font-semibold shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Visualisasi Tren Kunjungan UKS (6 Bulan)</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeNakesTab === 'analytics' ? (
        <UksTrendAnalytics />
      ) : (
        /* Main Grid: Left Patient Queue, Right Medical Assessment Sheet */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Clinic Queue */}
          <div className="lg:col-span-5 space-y-3 no-print">
            {/* Search & Filter */}
            <div className="bg-white p-3.5 rounded-xl border border-zinc-200 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari siswa/siswi, keluhan, atau nomor kamar..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-800 bg-white"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto text-xs">
                {['Semua', 'Darurat', 'Rawat UKS', 'Rujukan'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      filterStatus === st
                        ? 'bg-[#0D9488] text-white font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Queue List */}
            <div className="space-y-2">
              {filteredRecords.length === 0 ? (
                <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="font-semibold text-xs text-slate-800">Belum Ada Antrean Pasien</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Database register saat ini kosong. Data akan masuk otomatis saat siswa/siswi melakukan skrining atau dirujuk ke pos UKS.
                  </p>
                </div>
              ) : (
                filteredRecords.map((rec) => {
                  const isSelected = selectedRecord?.id === rec.id;
                  return (
                    <button
                      key={rec.id}
                      onClick={() => setSelectedRecordId(rec.id)}
                      className={`w-full p-4 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-white border-[#0D9488] ring-1 ring-[#0D9488] shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 line-clamp-1">
                            {rec.studentName || 'Shadiqia Fattaraditya Harjanto'}
                          </h3>
                          <p className="text-[11px] text-zinc-500 font-mono">
                            {rec.dormBuilding || 'Astra 1'} • {rec.dormRoom} • {rec.grade || 'XII-1'}
                          </p>
                        </div>
                        <TriageBadge level={rec.triageLevel} size="sm" />
                      </div>

                      <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed mb-2">
                        {rec.complaintTitle}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
                        <span className="flex items-center gap-1 font-mono tabular-nums">
                          <Thermometer className="w-3.5 h-3.5 text-zinc-500" />
                          {rec.vitalSigns?.temperature || '37.0°C'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-100 text-zinc-700">
                          {rec.status}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Medical Assessment Sheet */}
          <div className="lg:col-span-7">
            {selectedRecord ? (
              <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-6">
                {/* Header Profile */}
                <div className="flex items-start justify-between flex-wrap gap-2 pb-4 border-b border-zinc-100">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono uppercase text-zinc-500 block">
                      Rekam Medis Pasien UKS
                    </span>
                    <h2 className="text-base sm:text-lg font-semibold text-zinc-900">
                      {selectedRecord.studentName} ({selectedRecord.grade})
                    </h2>
                    <p className="text-xs text-zinc-500 font-mono">
                      Lokasi: {selectedRecord.dormBuilding} • {selectedRecord.dormRoom}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TriageBadge level={selectedRecord.triageLevel} size="sm" />
                  </div>
                </div>

                {/* Triage & Anamnesis */}
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2 text-xs">
                  <span className="font-semibold text-zinc-700 uppercase tracking-wider block">
                    Anamnesis & Skrining Klinis:
                  </span>
                  <p className="font-semibold text-zinc-900 text-sm">{selectedRecord.complaintTitle}</p>
                  <p className="text-zinc-700 leading-relaxed"><FormattedText text={selectedRecord.complaintDetails} /></p>
                  <p className="text-zinc-500 italic">
                    Tindakan awal mandiri: <FormattedText text={selectedRecord.actionsTaken} />
                  </p>
                </div>

                {/* Vital Signs Grid */}
                <div className="space-y-2 text-xs">
                  <span className="font-semibold text-zinc-700 uppercase tracking-wider block">
                    Tanda-Tanda Vital Terakhir:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      <span className="text-zinc-500 block text-[10px] uppercase">Suhu Tubuh</span>
                      <span className="font-semibold font-mono text-zinc-900 text-sm mt-0.5 block tabular-nums">
                        {selectedRecord.vitalSigns?.temperature || '37.2°C'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      <span className="text-zinc-500 block text-[10px] uppercase">Tekanan Darah</span>
                      <span className="font-semibold font-mono text-zinc-900 text-sm mt-0.5 block tabular-nums">
                        {selectedRecord.vitalSigns?.bloodPressure || '115/75 mmHg'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      <span className="text-zinc-500 block text-[10px] uppercase">Denyut Nadi</span>
                      <span className="font-semibold font-mono text-zinc-900 text-sm mt-0.5 block tabular-nums">
                        {selectedRecord.vitalSigns?.pulse || '82 bpm'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      <span className="text-zinc-500 block text-[10px] uppercase">Saturasi O2</span>
                      <span className="font-semibold font-mono text-zinc-900 text-sm mt-0.5 block tabular-nums">
                        {selectedRecord.vitalSigns?.spO2 || '99%'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons for Healthcare Staff */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 no-print">
                  <button
                    onClick={() => setIsExamModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>Input Pemeriksaan Fisik & Resep UKS</span>
                  </button>

                  <button
                    onClick={() => {
                      const slip: UKSReferralSlip = {
                        ringkasanKeluhan: `${selectedRecord.complaintTitle} (${selectedRecord.complaintDetails})`,
                        dugaanKategori: 'Pemeriksaan UKS Sekolah',
                        urgensi: selectedRecord.triageLevel,
                        tindakanAwal: selectedRecord.actionsTaken,
                        rekomendasiUntukUKS: `Pemeriksaan klinis oleh ${currentUser.name}. Status: ${selectedRecord.status}`,
                        tandaBahaya: 'Demam tinggi >38.5°C, sesak napas, atau perburukan gejala.',
                        generatedAt: new Date().toISOString(),
                        studentName: selectedRecord.studentName,
                        dormRoom: selectedRecord.dormRoom,
                        grade: selectedRecord.grade,
                      };
                      onOpenUksSlip(slip);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium text-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>Cetak Surat Rujukan</span>
                  </button>

                  <button
                    onClick={() => handleReferToHospital(selectedRecord)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-xs ml-auto transition-colors"
                  >
                    <Ambulance className="w-3.5 h-3.5" />
                    <span>Rujuk ke IGD RSUD</span>
                  </button>
                </div>

                {/* Clinical Exam Form Modal */}
                {isExamModalOpen && (
                  <form
                    onSubmit={handleSaveClinicalExam}
                    className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs no-print"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4 text-[#0D9488]" />
                        <span>Form Pemeriksaan Fisik & Terapi Obat UKS</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsExamModalOpen(false)}
                        className="text-zinc-500 hover:text-zinc-800 font-medium"
                      >
                        Batal
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Suhu Tubuh (°C):</label>
                        <input
                          type="text"
                          value={examTemp}
                          onChange={(e) => setExamTemp(e.target.value)}
                          className="w-full p-2 rounded-lg border border-zinc-300 bg-white font-mono text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Tekanan Darah:</label>
                        <input
                          type="text"
                          value={examBP}
                          onChange={(e) => setExamBP(e.target.value)}
                          className="w-full p-2 rounded-lg border border-zinc-300 bg-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Denyut Nadi (bpm):</label>
                        <input
                          type="text"
                          value={examPulse}
                          onChange={(e) => setExamPulse(e.target.value)}
                          className="w-full p-2 rounded-lg border border-zinc-300 bg-white font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-zinc-700 block mb-1">
                        Catatan Dokter / Perawat UKS:
                      </label>
                      <textarea
                        rows={2}
                        value={examNotes}
                        onChange={(e) => setExamNotes(e.target.value)}
                        placeholder="misal: Faring hiperemis ringan, tidak ada suara napas tambahan, lesi gatal sela jari..."
                        className="w-full p-2.5 rounded-lg border border-zinc-300 bg-white text-xs text-zinc-900 leading-relaxed"
                      />
                    </div>

                    {/* Medications Selection */}
                    <div>
                      <label className="font-semibold text-zinc-700 block mb-1.5">
                        Pemberian Obat / Sediaan Farmasi UKS:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {commonMeds.map((med) => {
                          const isChosen = selectedMeds.includes(med);
                          return (
                            <button
                              key={med}
                              type="button"
                              onClick={() => handleToggleMed(med)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                                isChosen
                                  ? 'bg-zinc-900 text-white border-zinc-900'
                                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                              }`}
                            >
                              {isChosen ? '✓ ' : '+ '}
                              {med}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isObservingInUKS}
                          onChange={(e) => setIsObservingInUKS(e.target.checked)}
                          className="rounded text-[#0D9488] accent-[#0D9488]"
                        />
                        <span>Rawat Observasi di Ruang Bed UKS</span>
                      </label>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold rounded-lg shadow-xs transition-colors"
                      >
                        Simpan Hasil Pemeriksaan
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-zinc-200 text-center space-y-3">
                <Stethoscope className="w-8 h-8 text-zinc-400 mx-auto" />
                <h3 className="font-semibold text-sm text-zinc-900">Rekam Medis UKS Siap Digunakan</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                  Pilih salah satu antrean pasien di sebelah kiri atau tunggu hasil skrining mandiri siswa/siswi untuk melakukan pemeriksaan klinis dan resep obat.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
