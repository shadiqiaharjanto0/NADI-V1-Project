import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  FileText,
  User,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { StudentProfile, UKSReferralSlip } from '../types';
import { TriageBadge } from './TriageBadge';
import { FormattedText, stripMarkdown } from './FormattedText';

interface UksSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  slip: UKSReferralSlip | null;
  studentProfile: StudentProfile;
}

export const UksSlipModal: React.FC<UksSlipModalProps> = ({
  isOpen,
  onClose,
  slip,
  studentProfile,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !slip) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsApp = () => {
    const waText = `*LEMBAR RUJUKAN RESMI UKS - NADI HEALTH INTELLIGENCE*
Tanggal: ${new Date(slip.generatedAt).toLocaleString('id-ID')}
--------------------------------------------------
*IDENTITAS SISWA:*
- Nama Lengkap: ${studentProfile.name}
- Kelas / Rombel: ${studentProfile.grade}
- Gedung Asrama: ${studentProfile.dormBuilding} (${studentProfile.dormRoom})
- Riwayat Alergi: ${studentProfile.allergies || 'Tidak ada'}

*HASIL SKRINING TRIASE:*
- Tingkat Urgensi: LEVEL ${slip.urgensi}
- Ringkasan Keluhan: ${stripMarkdown(slip.ringkasanKeluhan)}
- Dugaan Kategori: ${stripMarkdown(slip.dugaanKategori)}
- Tindakan Awal di Asrama: ${stripMarkdown(slip.tindakanAwal)}
- Rekomendasi Pemeriksaan UKS: ${stripMarkdown(slip.rekomendasiUntukUKS)}
- Tanda Bahaya Diwaspadai: ${stripMarkdown(slip.tandaBahaya || '-')}

Catatan: Dokumen ini diterbitkan oleh Sistem Skrining NADI untuk pendampingan oleh Pembina Asrama & pemeriksaan Petugas Medis UKS.`;

    navigator.clipboard.writeText(waText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto print-modal-backdrop">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 print-modal-container">
        {/* Apple Minimalist Header (Hidden in Print) */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-200">
              <FileText className="w-4 h-4 text-[#0D9488]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Surat Pengantar & Lembar Rujukan UKS
              </h3>
              <p className="text-xs text-zinc-500">
                Dokumen Resmi Layanan Kesehatan & Pengawasan Asrama
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Document Body */}
        <div className="printable-document p-6 sm:p-8 space-y-6 text-zinc-900 bg-white">
          {/* Official Letterhead */}
          <div className="border-b-2 border-zinc-800 pb-4 text-center space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
              Pemerintah Daerah Provinsi • Dinas Pendidikan & Kebudayaan
            </p>
            <h1 className="text-base font-bold uppercase tracking-tight text-zinc-900">
              UNIT KESEHATAN SEKOLAH (UKS) & POS MEDIS ASRAMA
            </h1>
            <p className="text-xs text-zinc-600">
              SMA Boarding School Kampus Utama • Layanan Kesehatan Siswa/Siswi 24 Jam
            </p>
            <div className="pt-1 text-[11px] text-zinc-500 font-mono">
              No. Registrasi Skrining: REF-{Date.now().toString().slice(-6)} • Waktu:{' '}
              {new Date(slip.generatedAt).toLocaleString('id-ID', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-sm font-bold tracking-tight uppercase underline underline-offset-4 text-zinc-900">
              SURAT PENGANTAR PEMERIKSAAN KESEHATAN
            </h2>
          </div>

          {/* Student Identity Table */}
          <div className="border border-zinc-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-zinc-50 px-3 py-2 font-semibold border-b border-zinc-200 text-zinc-700">
              I. Identitas Siswa / Siswi
            </div>
            <div className="p-3 grid grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <span className="text-zinc-500 block">Nama Lengkap:</span>
                <span className="font-semibold text-zinc-900">{studentProfile.name}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Kelas / Tingkat:</span>
                <span className="font-semibold text-zinc-900">{studentProfile.grade || '-'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Gedung & Kamar Asrama:</span>
                <span className="font-semibold text-zinc-900">
                  {studentProfile.dormBuilding} • {studentProfile.dormRoom}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Riwayat Alergi / Komorbid:</span>
                <span className="font-medium text-zinc-800">
                  {studentProfile.allergies || 'Tidak ada riwayat alergi obat berat'}
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Findings & Triage */}
          <div className="border border-zinc-200 rounded-lg overflow-hidden text-xs space-y-0">
            <div className="bg-zinc-50 px-3 py-2 font-semibold border-b border-zinc-200 text-zinc-700 flex items-center justify-between">
              <span>II. Hasil Skrining Klinis Awal</span>
              <span className="text-[11px] font-mono font-semibold uppercase">
                Tingkat Urgensi: LEVEL {slip.urgensi}
              </span>
            </div>
            <div className="p-3 space-y-3">
              <div>
                <span className="text-zinc-500 block">Keluhan yang Dilaporkan:</span>
                <p className="mt-1 font-medium text-zinc-900 leading-relaxed bg-zinc-50 p-2.5 rounded border border-zinc-200">
                  <FormattedText text={slip.ringkasanKeluhan} />
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-zinc-500 block">Kategori Keluhan:</span>
                  <p className="font-medium text-zinc-800 mt-0.5">{slip.dugaanKategori}</p>
                </div>
                <div>
                  <span className="text-zinc-500 block">Tindakan Awal Asrama:</span>
                  <p className="font-medium text-zinc-800 mt-0.5">
                    <FormattedText text={slip.tindakanAwal || 'Istirahat dan rehidrasi di kamar asrama'} />
                  </p>
                </div>
              </div>

              <div>
                <span className="text-zinc-500 block">Rekomendasi Penanganan Medis:</span>
                <p className="font-medium text-zinc-800 mt-0.5 leading-relaxed">
                  <FormattedText text={slip.rekomendasiUntukUKS} />
                </p>
              </div>

              {slip.tandaBahaya && (
                <div className="p-2.5 rounded border border-zinc-300 bg-zinc-50 text-[11px] space-y-0.5">
                  <span className="font-semibold text-zinc-900">Tanda Bahaya Red Flags: </span>
                  <span className="text-zinc-700">
                    <FormattedText text={slip.tandaBahaya} />
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Attending Signature Lines */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-12">
              <p className="text-zinc-600">Pembina Asrama Pendamping,</p>
              <div>
                <p className="font-semibold underline text-zinc-900">
                  {studentProfile.emergencyContactName.split('(')[0].trim()}
                </p>
                <p className="text-[10px] text-zinc-500">NIP / Jabatan Pembina</p>
              </div>
            </div>

            <div className="space-y-12">
              <p className="text-zinc-600">Petugas Medis / Pemeriksa UKS,</p>
              <div>
                <p className="font-semibold underline text-zinc-900">
                  dr. Nurul Hidayah / Ns. Siti Rahmah
                </p>
                <p className="text-[10px] text-zinc-500">SIP. 503/440/SIP-D/2024</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200 text-[10px] text-zinc-500 text-center leading-relaxed">
            Dokumen ini dicetak melalui Sistem Informasi NADI Health Intelligence SMA Boarding School. Dokumen ini sah sebagai surat pengantar observasi kesehatan siswa/siswi.
          </div>
        </div>

        {/* Footer Actions (Hidden during print) */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={handleCopyWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 text-xs font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Ringkasan</span>
                </>
              )}
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
