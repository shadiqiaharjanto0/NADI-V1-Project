import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Clock,
  Thermometer,
  FileText,
  MessageSquare,
  CheckCircle,
  Download,
  Printer,
  ChevronRight,
  User,
  HeartPulse,
} from 'lucide-react';
import { HealthRecord, StudentProfile, UKSReferralSlip, TriageUrgency } from '../types';
import { TriageBadge } from './TriageBadge';
import { exportSiswaPersonalXLSX } from '../utils/exportUtils';
import { FormattedText } from './FormattedText';

interface HealthDiaryViewProps {
  records: HealthRecord[];
  onAddRecord: (record: Omit<HealthRecord, 'id' | 'updates'>) => void;
  onUpdateRecord: (
    recordId: string,
    updateNote: string,
    newStatus?: 'Aktif' | 'Membaik' | 'Selesai' | 'Dirujuk ke UKS',
    temperature?: string
  ) => void;
  onOpenUksSlip: (slip: UKSReferralSlip) => void;
  onConsultNadi: (promptText: string) => void;
  studentProfile: StudentProfile;
}

export const HealthDiaryView: React.FC<HealthDiaryViewProps> = ({
  records,
  onAddRecord,
  onUpdateRecord,
  onOpenUksSlip,
  onConsultNadi,
  studentProfile,
}) => {
  // Scoped strictly to student's records
  const personalRecords = records.filter(
    (r) => !r.studentName || r.studentName === studentProfile.name || r.studentId === 'user-siswa-1'
  );

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(
    personalRecords[0]?.id || null
  );
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('Semua');

  // New Record Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newDuration, setNewDuration] = useState('1 hari');
  const [newSeverity, setNewSeverity] = useState(4);
  const [newTriage, setNewTriage] = useState<TriageUrgency>('HIJAU');
  const [newActions, setNewActions] = useState('');

  // Update State
  const [updateNote, setUpdateNote] = useState('');
  const [updateTemp, setUpdateTemp] = useState('');
  const [updateStatus, setUpdateStatus] = useState<
    'Aktif' | 'Membaik' | 'Selesai' | 'Dirujuk ke UKS'
  >('Membaik');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredRecords = personalRecords.filter((r) => {
    if (filterStatus === 'Semua') return true;
    return r.status === filterStatus;
  });

  const activeRecord = personalRecords.find((r) => r.id === selectedRecordId) || personalRecords[0];

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddRecord({
      timestamp: new Date().toISOString(),
      complaintTitle: newTitle,
      complaintDetails: newDetails,
      duration: newDuration,
      severity: newSeverity,
      triageLevel: newTriage,
      actionsTaken: newActions || 'Istirahat di tempat tidur kamar asrama Astra 1',
      status: 'Aktif',
    });

    setIsAddingNew(false);
    setNewTitle('');
    setNewDetails('');
    setNewActions('');
  };

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateNote.trim() || !activeRecord) return;

    onUpdateRecord(activeRecord.id, updateNote, updateStatus, updateTemp || undefined);
    setUpdateNote('');
    setUpdateTemp('');
    setIsUpdating(false);
  };

  const handleGenerateSlipForRecord = (rec: HealthRecord) => {
    const slip: UKSReferralSlip = {
      ringkasanKeluhan: `${rec.complaintTitle} (${rec.complaintDetails})`,
      dugaanKategori: 'Pemantauan Keluhan Siswa Asrama',
      urgensi: rec.triageLevel,
      tindakanAwal: rec.actionsTaken,
      rekomendasiUntukUKS: `Pemeriksaan lanjutan keluhan siswa (Status: ${rec.status}). Evaluasi tanda vital dan penanganan obat dari pos UKS.`,
      tandaBahaya: 'Demam meningkat di atas 38°C, lemas ekstrem, atau keluhan tidak membaik setelah 48 jam.',
      generatedAt: new Date().toISOString(),
      studentName: studentProfile.name,
      grade: studentProfile.grade,
      dormRoom: `${studentProfile.dormBuilding} ${studentProfile.dormRoom}`,
    };
    onOpenUksSlip(slip);
  };

  const handleExportPersonalXlsx = () => {
    exportSiswaPersonalXLSX(studentProfile, personalRecords);
  };

  const handlePrintPersonalReport = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header Card - Apple Minimalist */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            <ClipboardList className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Rekam Kesehatan Mandiri Siswa</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Buku Catatan Kesehatan Pribadi
          </h1>
          <p className="text-xs text-zinc-500">
            Siswa: <strong className="text-zinc-800">{studentProfile.name}</strong> • Kelas <strong className="text-zinc-800">{studentProfile.grade}</strong> ({studentProfile.dormBuilding}, {studentProfile.dormRoom})
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleExportPersonalXlsx}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium border border-zinc-200 transition-colors"
            title="Download Spreadsheet Excel / Sheets"
          >
            <Download className="w-3.5 h-3.5 text-zinc-600" />
            <span>Ekspor XLSX (Excel)</span>
          </button>

          <button
            onClick={handlePrintPersonalReport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium border border-zinc-200 transition-colors"
            title="Cetak Halaman PDF"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-600" />
            <span>Cetak PDF</span>
          </button>

          <button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0071E3] hover:bg-blue-600 text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Keluhan Baru</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Records List, Right Detailed Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Filter & Records List */}
        <div className="lg:col-span-5 space-y-3 no-print">
          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl text-xs font-medium overflow-x-auto">
            {['Semua', 'Aktif', 'Membaik', 'Dirujuk ke UKS', 'Selesai'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {filteredRecords.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-zinc-300 text-center text-xs text-zinc-500 space-y-2">
              <ClipboardList className="w-8 h-8 mx-auto text-zinc-400" />
              <p className="font-medium text-zinc-700">Belum ada riwayat keluhan di kategori ini.</p>
              <button
                onClick={() => setIsAddingNew(true)}
                className="text-[#0071E3] hover:underline font-semibold"
              >
                Catat keluhan kesehatan pertama
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRecords.map((rec) => {
                const isSelected = activeRecord?.id === rec.id;
                return (
                  <button
                    key={rec.id}
                    onClick={() => {
                      setSelectedRecordId(rec.id);
                      setIsAddingNew(false);
                    }}
                    className={`w-full p-4 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-white border-zinc-900 ring-1 ring-zinc-900 shadow-xs'
                        : 'bg-white hover:bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 line-clamp-1">
                        {rec.complaintTitle}
                      </h3>
                      <TriageBadge level={rec.triageLevel} size="sm" />
                    </div>

                    <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed mb-3">
                      {rec.complaintDetails}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
                      <span className="flex items-center gap-1 font-mono tabular-nums">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        {new Date(rec.timestamp).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="font-medium text-zinc-700 font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-zinc-100">
                        {rec.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Active Record Details or New Form */}
        <div className="lg:col-span-7">
          {isAddingNew ? (
            /* Add Record Form */
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="font-semibold text-sm text-zinc-900">
                  Formulir Catatan Keluhan Mandiri
                </h3>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-800"
                >
                  Batal
                </button>
              </div>

              <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Judul Keluhan Utama:
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="misal: Demam ringan & tenggorokan nyeri menelan"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-zinc-900 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Rincian Gejala & Kondisi:
                  </label>
                  <textarea
                    rows={3}
                    value={newDetails}
                    onChange={(e) => setNewDetails(e.target.value)}
                    placeholder="Jelaskan sejak kapan keluhan dirasakan, apakah ada mual, pusing, batuk, atau sesak..."
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-zinc-900 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      Durasi Gejala:
                    </label>
                    <select
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-zinc-900 bg-white text-xs"
                    >
                      <option value="Beberapa jam yang lalu">Beberapa jam yang lalu</option>
                      <option value="1 hari">1 hari</option>
                      <option value="2 hari">2 hari</option>
                      <option value="3-4 hari">3-4 hari</option>
                      <option value="Lebih dari 5 hari">Lebih dari 5 hari</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      Estimasi Skrining Urgensi:
                    </label>
                    <select
                      value={newTriage}
                      onChange={(e) => setNewTriage(e.target.value as TriageUrgency)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-zinc-900 bg-white text-xs font-medium"
                    >
                      <option value="HIJAU">LEVEL 1: HIJAU (Observasi Mandiri)</option>
                      <option value="KUNING">LEVEL 2: KUNING (Perlu Cek UKS)</option>
                      <option value="MERAH">LEVEL 3: MERAH (Gawat Darurat)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Tindakan Awal yang Sudah Dilakukan di Asrama:
                  </label>
                  <input
                    type="text"
                    value={newActions}
                    onChange={(e) => setNewActions(e.target.value)}
                    placeholder="misal: Minum air hangat, kompres dahi, istirahat di kamar 204"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-zinc-900 bg-white text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-3.5 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#0071E3] hover:bg-blue-600 text-white font-semibold transition-colors shadow-xs"
                  >
                    Simpan ke Buku Catatan
                  </button>
                </div>
              </form>
            </div>
          ) : activeRecord ? (
            /* Active Record View */
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-zinc-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <TriageBadge level={activeRecord.triageLevel} size="md" />
                    <span className="font-mono text-xs text-zinc-500 tabular-nums">
                      {new Date(activeRecord.timestamp).toLocaleString('id-ID', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-zinc-900">
                    {activeRecord.complaintTitle}
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Status: <strong className="text-zinc-800">{activeRecord.status}</strong> • Durasi: <strong className="text-zinc-800">{activeRecord.duration}</strong>
                  </p>
                </div>

                {/* Slip & UKS Actions */}
                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={() => handleGenerateSlipForRecord(activeRecord)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Lembar Rujukan UKS</span>
                  </button>
                </div>
              </div>

              {/* Vitals Summary Card */}
              {activeRecord.vitalSigns && (
                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Suhu Tubuh</span>
                    <span className="font-mono text-sm font-semibold text-zinc-900 tabular-nums">
                      {activeRecord.vitalSigns.temperature || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Tekanan Darah</span>
                    <span className="font-mono text-sm font-semibold text-zinc-900 tabular-nums">
                      {activeRecord.vitalSigns.bloodPressure || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Denyut Nadi</span>
                    <span className="font-mono text-sm font-semibold text-zinc-900 tabular-nums">
                      {activeRecord.vitalSigns.pulse || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Saturasi Oksigen</span>
                    <span className="font-mono text-sm font-semibold text-zinc-900 tabular-nums">
                      {activeRecord.vitalSigns.spO2 || '-'}
                    </span>
                  </div>
                </div>
              )}

              {/* Description & Initial Actions */}
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-semibold text-zinc-700">Rincian Keluhan:</h4>
                  <p className="mt-1 text-zinc-900 leading-relaxed bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                    <FormattedText text={activeRecord.complaintDetails} />
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-zinc-700">Tindakan Awal Mandiri:</h4>
                  <p className="mt-1 text-zinc-800">
                    <FormattedText text={activeRecord.actionsTaken} />
                  </p>
                </div>

                {activeRecord.medicationsGiven && activeRecord.medicationsGiven.length > 0 && (
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                    <span className="font-semibold text-zinc-800 block mb-1">
                      Terapi Obat Diberikan Petugas UKS:
                    </span>
                    <p className="text-zinc-700 font-mono">
                      {activeRecord.medicationsGiven.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Updates Timeline */}
              <div className="space-y-3 pt-4 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-zinc-800">
                    Histori Pemantauan & Catatan Perkembangan:
                  </h4>
                  <button
                    onClick={() => setIsUpdating(!isUpdating)}
                    className="text-xs text-[#0071E3] font-medium hover:underline no-print"
                  >
                    {isUpdating ? 'Batal Update' : '+ Tambah Catatan Kondisi'}
                  </button>
                </div>

                {isUpdating && (
                  <form onSubmit={handleAddUpdate} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3 text-xs no-print">
                    <div>
                      <label className="block font-semibold text-zinc-700 mb-1">
                        Catatan Perkembangan Kondisi Terkini:
                      </label>
                      <input
                        type="text"
                        value={updateNote}
                        onChange={(e) => setUpdateNote(e.target.value)}
                        placeholder="misal: Demam sudah turun, sakit tenggorokan berkurang..."
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-zinc-900 bg-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-zinc-700 mb-1">
                          Suhu Saat Ini (°C):
                        </label>
                        <input
                          type="text"
                          value={updateTemp}
                          onChange={(e) => setUpdateTemp(e.target.value)}
                          placeholder="misal: 36.8°C"
                          className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-zinc-900 bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-zinc-700 mb-1">
                          Status Evaluasi:
                        </label>
                        <select
                          value={updateStatus}
                          onChange={(e) => setUpdateStatus(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-zinc-900 bg-white"
                        >
                          <option value="Aktif">Masih Aktif</option>
                          <option value="Membaik">Sudah Membaik</option>
                          <option value="Dirujuk ke UKS">Perlu ke UKS</option>
                          <option value="Selesai">Sembuh / Selesai</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsUpdating(false)}
                        className="px-3 py-1.5 text-zinc-600 hover:bg-zinc-200 rounded-md"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-[#0071E3] hover:bg-blue-600 text-white font-medium rounded-md shadow-xs"
                      >
                        Simpan Catatan
                      </button>
                    </div>
                  </form>
                )}

                {activeRecord.updates.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">
                    Belum ada riwayat perkembangan lanjutan.
                  </p>
                ) : (
                  <div className="space-y-2 text-xs">
                    {activeRecord.updates.map((up) => (
                      <div key={up.id} className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 space-y-1">
                        <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 tabular-nums">
                          <span>{new Date(up.timestamp).toLocaleString('id-ID')}</span>
                          <span className="font-semibold text-zinc-700 uppercase">
                            {up.authorName || 'Siswa'} ({up.authorRole || 'siswa'})
                          </span>
                        </div>
                        <p className="text-zinc-800"><FormattedText text={up.note} /></p>
                        {up.temperature && (
                          <span className="inline-block font-mono text-[10px] text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200">
                            Suhu Terukur: {up.temperature}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
