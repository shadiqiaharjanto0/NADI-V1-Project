import React, { useState } from 'react';
import {
  PhoneCall,
  X,
  ShieldAlert,
  Ambulance,
  HeartPulse,
  Flame,
  Shield,
  Copy,
  Check,
  MapPin,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: StudentProfile;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  studentProfile,
}) => {
  const [copiedLocation, setCopiedLocation] = useState(false);

  if (!isOpen) return null;

  const emergencyAddress = `Kampus SMA Boarding School, Gedung ${studentProfile.dormBuilding}, ${studentProfile.dormRoom}. Pasien: ${studentProfile.name} (${studentProfile.grade}).`;

  const handleCopyLocation = () => {
    navigator.clipboard.writeText(emergencyAddress).then(() => {
      setCopiedLocation(true);
      setTimeout(() => setCopiedLocation(false), 2500);
    });
  };

  const emergencyContacts = [
    {
      number: '112',
      title: 'Panggilan Darurat Terpadu Nasional',
      agency: 'Kemenkominfo & BPBD RI',
      desc: 'Bebas pulsa dari semua operator seluler & telepon rumah. Mengoordinasikan ambulans, medis, damkar, dan penyelamatan serentak.',
      type: 'national',
      icon: PhoneCall,
      highlight: true,
    },
    {
      number: '119',
      title: 'PSC 119 Gawat Darurat Medis Kemenkes',
      agency: 'Kementerian Kesehatan RI (SPGDT)',
      desc: 'Pusat Komando Layanan Ambulans Gawat Darurat & Bantuan Hidup Dasar Medis Nasional.',
      type: 'medical',
      icon: HeartPulse,
      highlight: true,
    },
    {
      number: '118',
      title: 'Layanan Ambulans Gawat Darurat & PMI',
      agency: 'Dinas Kesehatan & Palang Merah',
      desc: 'Penjemputan pasien kritis dan pertolongan pertama kecelakaan pra-rumah sakit.',
      type: 'medical',
      icon: Ambulance,
      highlight: false,
    },
    {
      number: '110',
      title: 'Panggilan Kepolisian Republik Indonesia',
      agency: 'Polri',
      desc: 'Penanganan insiden keamanan, tindak kriminal darurat, dan pengawalan darurat jalan raya.',
      type: 'police',
      icon: Shield,
      highlight: false,
    },
    {
      number: '113',
      title: 'Dinas Pemadam Kebakaran & Penyelamatan',
      agency: 'Damkar RI',
      desc: 'Evakuasi kebakaran gedung, kebocoran gas, bahaya struktural bangunan asrama.',
      type: 'fire',
      icon: Flame,
      highlight: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-sm overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-zinc-200 overflow-hidden my-6">
        {/* Apple Minimalist Header */}
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
                Pusat Panggilan Darurat Indonesia & Asrama
              </h2>
              <p className="text-xs text-zinc-500">
                Layanan Gawat Darurat Medis Resmi (Kemenkes RI, Nasional 112 & Pos UKS)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Critical Location Call-out for Dispatch Operator */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-700">
                <MapPin className="w-4 h-4 text-[#0071E3]" />
                <span>Format Informasi Lokasi untuk Operator 112 / 119</span>
              </div>
              <button
                onClick={handleCopyLocation}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-[#0071E3] hover:bg-blue-50 transition-colors border border-blue-200"
              >
                {copiedLocation ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Teks Alamat</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs font-mono text-zinc-800 bg-white p-2.5 rounded-lg border border-zinc-200 leading-relaxed">
              &quot;{emergencyAddress}&quot;
            </p>
            <p className="text-[11px] text-zinc-500">
              Bacakan teks di atas saat operator darurat menanyakan lokasi kejadian secara spesifik.
            </p>
          </div>

          {/* School Internal Emergency Hotlines */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Hotline Siaga Internal Sekolah (24 Jam)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Petugas Medis UKS */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-[#0071E3] border border-blue-100">
                      Pos Medis UKS
                    </span>
                    <HeartPulse className="w-4 h-4 text-[#0071E3]" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-900">
                    Klinik & Pos Rawat UKS
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Tenaga kesehatan siaga, ranjang observasi, dan oksigen darurat.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                  <span className="font-mono text-xs font-medium text-zinc-800 tabular-nums">
                    {studentProfile.uksContactPhone}
                  </span>
                  <a
                    href={`tel:${studentProfile.uksContactPhone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0071E3] hover:bg-blue-600 text-white text-xs font-medium transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Panggil UKS</span>
                  </a>
                </div>
              </div>

              {/* Pembina Asrama */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200">
                      Wali Asrama
                    </span>
                    <PhoneCall className="w-4 h-4 text-zinc-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-900 truncate">
                    {studentProfile.emergencyContactName}
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Pendampingan evakuasi siswa/siswi dan otorisasi tindakan rujukan.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                  <span className="font-mono text-xs font-medium text-zinc-800 tabular-nums">
                    {studentProfile.emergencyContactPhone}
                  </span>
                  <a
                    href={`tel:${studentProfile.emergencyContactPhone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Panggil Pembina</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Official Indonesian National Emergency Numbers */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Layanan Darurat Nasional Republik Indonesia (Bebas Pulsa)
            </h3>

            <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 overflow-hidden bg-white">
              {emergencyContacts.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.number}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/60 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold font-mono text-base shrink-0 border border-zinc-200">
                        {item.number}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-zinc-900">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-zinc-500">
                            ({item.agency})
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600 leading-relaxed max-w-md">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`tel:${item.number}`}
                      className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                        item.highlight
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200'
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Hubungi {item.number}</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick First-Aid Checklist (Anti-Slop / Clear Clinical Actions) */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2 text-xs">
            <h4 className="font-semibold text-zinc-900">
              Prosedur Tanggap Darurat Sambil Menunggu Bantuan Medis:
            </h4>
            <ul className="space-y-1.5 text-zinc-600 pl-4 list-disc leading-relaxed">
              <li>
                <strong>Sesak Napas Berat:</strong> Posisikan siswa duduk tegak bersandar ke depan, longgarkan kerah baju, jangan dikerumuni agar sirkulasi udara lancar.
              </li>
              <li>
                <strong>Penurunan Kesadaran / Pingsan:</strong> Baringkan di tempat datar, tinggikan kaki 30 cm, atau miringkan ke sisi kiri (posisi pemulihan) jika ada mual/muntah.
              </li>
              <li>
                <strong>Kejang:</strong> Jangan masukkan benda apa pun ke dalam mulut. Singkirkan benda keras/tajam di sekitar kepala.
              </li>
              <li>
                <strong>Jangan Pernah Memberi Minum</strong> kepada siswa yang tidak sadar penuh atau tersedak.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Sistem Triase Medis NADI • Keamanan Pasien Terpadu
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-medium transition-colors"
          >
            Tutup Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
