import React, { useState } from 'react';
import {
  School,
  AlertOctagon,
  Bed,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  FileText,
  Building,
  User,
  HeartPulse,
  Thermometer,
  ShieldAlert,
  Download,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { HealthRecord, AuthUser, UKSReferralSlip } from '../types';
import { TriageBadge } from './TriageBadge';
import { exportPembinaAsramaXLSX } from '../utils/exportUtils';
import { FormattedText } from './FormattedText';

interface PembinaDashboardProps {
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

export const PembinaDashboard: React.FC<PembinaDashboardProps> = ({
  currentUser,
  records,
  onUpdateRecord,
  onOpenUksSlip,
  onConsultNadi,
  onEmergencyTrigger,
}) => {
  const [filterDorm, setFilterDorm] = useState<string>('Semua');
  const [filterClass, setFilterClass] = useState<string>('Semua');
  const [filterRoom, setFilterRoom] = useState<string>('Semua');
  const [filterLevel, setFilterLevel] = useState<string>('Semua');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(
    records[0]?.id || null
  );
  const [visitNote, setVisitNote] = useState('');
  const [isAddingVisit, setIsAddingVisit] = useState(false);

  const selectedRecord = records.find((r) => r.id === selectedRecordId) || records[0];

  // Distinct rooms
  const rooms = Array.from(new Set(records.map((r) => r.dormRoom || 'Kamar 204'))).filter(Boolean);

  const filteredRecords = records.filter((r) => {
    const matchesDorm = filterDorm === 'Semua' || r.dormBuilding === filterDorm;
    const matchesClass = filterClass === 'Semua' || (r.grade && r.grade.startsWith(filterClass));
    const matchesRoom = filterRoom === 'Semua' || r.dormRoom === filterRoom;
    const matchesLevel = filterLevel === 'Semua' || r.triageLevel === filterLevel;
    return matchesDorm && matchesClass && matchesRoom && matchesLevel;
  });

  // Summary Metrics
  const totalSick = records.filter((r) => r.status !== 'Selesai').length;
  const emergencyCount = records.filter((r) => r.triageLevel === 'MERAH' && r.status !== 'Selesai').length;
  const bedRestCount = records.filter((r) => r.dispensationApproved && r.status !== 'Selesai').length;
  const uksReferredCount = records.filter((r) => r.status === 'Dirujuk ke UKS' || r.status === 'Observasi Rawat UKS' || r.status === 'Rujuk RS').length;

  const handleAddVisitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitNote.trim() || !selectedRecord) return;

    onUpdateRecord(
      selectedRecord.id,
      `[Kunjungan Pembina - ${currentUser.name}]: ${visitNote.trim()}`,
      selectedRecord.status
    );
    setVisitNote('');
    setIsAddingVisit(false);
  };

  const handleToggleDispensation = (record: HealthRecord) => {
    const newStatus = !record.dispensationApproved;
    onUpdateRecord(
      record.id,
      `[Dispensasi KBM]: ${newStatus ? 'Disetujui izin istirahat kamar oleh Pembina Asrama' : 'Dispensasi istirahat kamar dicabut'}`
    );
  };

  const handleAskNadiSOP = (complaintTitle: string) => {
    const prompt = `Halo NADI, saya Pembina Asrama (${currentUser.name}). Di asrama ada siswa/siswi dengan keluhan "${complaintTitle}". Mohon panduan SOP tindakan pembina, apakah perlu isolasi kamar, dan apa yang harus disiapkan untuk petugas UKS?`;
    onConsultNadi(prompt);
  };

  const handleExportXlsx = () => {
    exportPembinaAsramaXLSX(records, filterDorm, filterClass);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header Card - Apple Minimalist */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-500">
            <School className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>Pengawasan Hunian Kamar & Dispensasi Belajar</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-800">
            Monitoring Kesehatan Gedung Asrama
          </h1>
          <p className="text-xs text-slate-500">
            Wali Asrama: <strong className="text-slate-800">{currentUser.name}</strong> • Wilayah Pengawasan: <strong className="text-slate-800">{currentUser.building || 'Astra 1 (Kelas XII)'}</strong>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleExportXlsx}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium border border-zinc-200 transition-colors"
            title="Ekspor Rekap Asrama ke Spreadsheet Excel / Google Sheets"
          >
            <Download className="w-3.5 h-3.5 text-zinc-600" />
            <span>Ekspor XLSX Asrama</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium border border-zinc-200 transition-colors"
            title="Cetak Laporan Pemantauan Kamar ke PDF"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-600" />
            <span>Cetak PDF</span>
          </button>

          <button
            onClick={onEmergencyTrigger}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Kontak Darurat 119</span>
          </button>
        </div>
      </div>

      {/* Metrics Row - Tabular & Clean */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs no-print">
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <span className="text-zinc-500 block text-[11px]">Siswa/Siswi Sakit Aktif</span>
          <span className="text-xl font-semibold text-zinc-900 mt-1 block font-mono tabular-nums">
            {totalSick} Siswa/Siswi
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <span className="text-zinc-500 block text-[11px]">Darurat Medis (Merah)</span>
          <span className="text-xl font-semibold text-red-600 mt-1 block font-mono tabular-nums">
            {emergencyCount} Kasus
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <span className="text-zinc-500 block text-[11px]">Izin Istirahat Kamar (Dispensasi)</span>
          <span className="text-xl font-semibold text-zinc-900 mt-1 block font-mono tabular-nums">
            {bedRestCount} Siswa/Siswi
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-zinc-200">
          <span className="text-zinc-500 block text-[11px]">Penanganan Pos UKS</span>
          <span className="text-xl font-semibold text-zinc-900 mt-1 block font-mono tabular-nums">
            {uksReferredCount} Siswa/Siswi
          </span>
        </div>
      </div>

      {/* Emergency Notice if any MERAH exists */}
      {emergencyCount > 0 && (
        <div className="p-4 rounded-xl border border-red-300 bg-red-50 text-red-950 flex items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <div className="text-xs space-y-0.5">
              <h3 className="font-semibold text-red-900 uppercase">
                Perhatian: Terdapat {emergencyCount} Siswa/Siswi dengan Tingkat Urgensi MERAH
              </h3>
              <p className="text-red-800">
                Segera lakukan pendampingan fisik di kamar atau evakuasi rujukan ke IGD / Pos UKS.
              </p>
            </div>
          </div>
          <button
            onClick={onEmergencyTrigger}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-xs shrink-0 transition-colors"
          >
            Prosedur SOS
          </button>
        </div>
      )}

      {/* Main Grid: Left Filtered Records, Right Detailed Room Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student List in Dorm */}
        <div className="lg:col-span-5 space-y-3 no-print">
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-zinc-200 space-y-3 text-xs">
            {/* Dorm Filter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-zinc-700 uppercase text-[10px]">Gedung Asrama:</span>
                <span className="text-zinc-500 font-mono text-[11px] tabular-nums">{filteredRecords.length} siswa/siswi</span>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {['Semua', 'Astra 1', 'Astra 2', 'Astra 3', 'Astri 1', 'Astri 2', 'Astri 3'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setFilterDorm(d)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                      filterDorm === d
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {d === 'Semua' ? 'Semua Gedung' : d}
                  </button>
                ))}
              </div>
            </div>

            {/* Class Level Filter */}
            <div className="pt-2 border-t border-zinc-100">
              <span className="font-semibold text-zinc-700 uppercase text-[10px] block mb-1">Tingkat Kelas:</span>
              <div className="flex items-center gap-1">
                {['Semua', 'XII', 'XI', 'X'].map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setFilterClass(cls)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      filterClass === cls
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {cls === 'Semua' ? 'Semua Kelas' : `Kelas ${cls}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Filter */}
            <div className="pt-2 border-t border-zinc-100">
              <span className="font-semibold text-zinc-700 uppercase text-[10px] block mb-1">Nomor Kamar:</span>
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                <button
                  onClick={() => setFilterRoom('Semua')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    filterRoom === 'Semua' ? 'bg-zinc-900 text-white font-semibold' : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  Semua
                </button>
                {rooms.map((room) => (
                  <button
                    key={room}
                    onClick={() => setFilterRoom(room)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap ${
                      filterRoom === room ? 'bg-zinc-900 text-white font-semibold' : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Records List */}
          <div className="space-y-2">
            {filteredRecords.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-zinc-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-zinc-400 mx-auto" />
                <h4 className="font-semibold text-xs text-zinc-900">Seluruh Siswa/Siswi Kondisi Sehat</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Tidak ada laporan siswa/siswi sakit aktif pada filter gedung asrama saat ini. Laporan akan muncul otomatis saat skrining mandiri dilakukan.
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
                      <h3 className="font-semibold text-xs sm:text-sm text-slate-800">
                        {rec.studentName || 'Siswa Asrama'}
                      </h3>
                      <p className="text-[11px] text-zinc-500 font-mono">
                        {rec.dormBuilding || 'Asrama'} • {rec.dormRoom} • {rec.grade || 'Siswa'}
                      </p>
                    </div>
                    <TriageBadge level={rec.triageLevel} size="sm" />
                  </div>

                  <p className="text-xs text-zinc-600 line-clamp-1 mt-1">
                    {rec.complaintTitle}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2.5 pt-2 border-t border-zinc-100">
                    <span className="flex items-center gap-1 font-mono tabular-nums">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {new Date(rec.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {rec.dispensationApproved ? (
                      <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 font-mono font-medium text-[10px]">
                        Izin Kamar Aktif
                      </span>
                    ) : (
                      <span className="text-zinc-400 text-[10px] font-mono">Tanpa Izin Kamar</span>
                    )}
                  </div>
                </button>
              );
            }))}
          </div>
        </div>

        {/* Right Column: Selected Record Action Details */}
        <div className="lg:col-span-7">
          {selectedRecord ? (
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-6">
              {/* Top Details */}
              <div className="flex items-start justify-between flex-wrap gap-2 pb-4 border-b border-zinc-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-semibold text-zinc-900">
                      {selectedRecord.studentName}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                      {selectedRecord.dormRoom}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-mono">
                    {selectedRecord.dormBuilding} • Kelas {selectedRecord.grade}
                  </p>
                </div>
                <TriageBadge level={selectedRecord.triageLevel} size="md" />
              </div>

              {/* Complaint & Symptoms */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2 text-xs">
                <span className="font-semibold text-zinc-700 uppercase tracking-wider block">
                  Laporan Keluhan Siswa:
                </span>
                <p className="text-sm font-semibold text-zinc-900 leading-snug">
                  {selectedRecord.complaintTitle}
                </p>
                <p className="text-zinc-700 leading-relaxed">
                  <FormattedText text={selectedRecord.complaintDetails} />
                </p>
                {selectedRecord.vitalSigns?.temperature && (
                  <div className="flex items-center gap-2 pt-1 font-mono font-semibold text-xs text-zinc-800 tabular-nums">
                    <Thermometer className="w-3.5 h-3.5 text-zinc-600" />
                    Suhu Tubuh Terakhir: {selectedRecord.vitalSigns.temperature}
                  </div>
                )}
              </div>

              {/* Quick Actions for Pembina */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-zinc-700 uppercase tracking-wider block">
                  Tindakan & Otorisasi Pengawasan Kamar:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 no-print">
                  {/* Bed-rest Dispensation Toggle */}
                  <button
                    onClick={() => handleToggleDispensation(selectedRecord)}
                    className={`p-3.5 rounded-xl border text-left transition-colors flex items-start gap-2.5 ${
                      selectedRecord.dispensationApproved
                        ? 'bg-[#0D9488] text-white border-[#0D9488]'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <Bed className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">
                        {selectedRecord.dispensationApproved
                          ? 'Izin Istirahat Kamar: DISETUJUI'
                          : 'Beri Dispensasi Istirahat Kamar'}
                      </p>
                      <p className={`text-[11px] mt-0.5 ${selectedRecord.dispensationApproved ? 'text-teal-100' : 'text-slate-500'}`}>
                        {selectedRecord.dispensationApproved
                          ? 'Siswa sah beristirahat di kasur kamar & tidak ikut KBM.'
                          : 'Klik untuk mengizinkan siswa/siswi tidak mengikuti KBM kelas.'}
                      </p>
                    </div>
                  </button>

                  {/* Ask NADI SOP */}
                  <button
                    onClick={() => handleAskNadiSOP(selectedRecord.complaintTitle)}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors flex items-start gap-2.5"
                  >
                    <FileText className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        Konsultasi Pedoman SOP Asrama
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Dapatkan pedoman isolasi & kebersihan kamar dari NADI.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Add Warden Visit Note */}
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 uppercase tracking-wider">
                    Buku Catatan Kunjungan Kamar:
                  </span>
                  {!isAddingVisit && (
                    <button
                      onClick={() => setIsAddingVisit(true)}
                      className="text-xs text-[#0D9488] font-medium hover:underline flex items-center gap-1 no-print"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Catat Kunjungan Baru</span>
                    </button>
                  )}
                </div>

                {isAddingVisit && (
                  <form onSubmit={handleAddVisitNote} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs no-print">
                    <textarea
                      rows={2}
                      value={visitNote}
                      onChange={(e) => setVisitNote(e.target.value)}
                      placeholder="misal: Sudah dikunjungi pukul 20:30, siswa sedang tidur, hidrasi hangat dipantau ketua kamar..."
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white leading-relaxed"
                      required
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingVisit(false)}
                        className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-200 text-xs font-medium"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 rounded-md bg-[#0D9488] hover:bg-[#0F766E] text-white font-medium text-xs shadow-xs"
                      >
                        Simpan Catatan
                      </button>
                    </div>
                  </form>
                )}

                {/* History Updates */}
                <div className="space-y-2 pt-1">
                  {selectedRecord.updates.map((u) => (
                    <div key={u.id} className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                      <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 tabular-nums">
                        <span className="font-semibold text-zinc-700">{u.authorName || 'Petugas Asrama'}</span>
                        <span>{new Date(u.timestamp).toLocaleString('id-ID')}</span>
                      </div>
                      <p className="text-zinc-800 leading-relaxed">{u.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-zinc-200 text-center space-y-3">
              <School className="w-8 h-8 text-zinc-400 mx-auto" />
              <h3 className="font-semibold text-sm text-zinc-900">Monitoring Gedung Asrama Siap</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                Pilih laporan kamar siswa/siswi di sebelah kiri untuk melihat catatan keluhan, memverifikasi dispensasi izin istirahat kasur, atau berkonsultasi SOP tindakan dengan NADI AI.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
