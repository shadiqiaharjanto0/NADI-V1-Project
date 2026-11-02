import React, { useState } from 'react';
import {
  FileHeart,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  Square,
  Thermometer,
  Activity,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface GuidedTriageViewProps {
  studentProfile: StudentProfile;
  onSubmitTriage: (promptText: string) => void;
  onEmergencyTrigger: () => void;
}

export const GuidedTriageView: React.FC<GuidedTriageViewProps> = ({
  studentProfile,
  onSubmitTriage,
  onEmergencyTrigger,
}) => {
  const [category, setCategory] = useState('Demam & Gejala Umum');
  const [complaintText, setComplaintText] = useState('');
  const [duration, setDuration] = useState('1–2 hari');
  const [severity, setSeverity] = useState(4);
  const [actionsTaken, setActionsTaken] = useState('');
  const [redFlags, setRedFlags] = useState<{ [key: string]: boolean }>({});

  const redFlagOptions = [
    { id: 'sesak', label: 'Kesulitan bernapas atau napas terasa berat dan cepat' },
    { id: 'kesadaran', label: 'Penurunan kesadaran, sangat mengantuk sulit dibangunkan, atau pingsan' },
    { id: 'nyeri_dada', label: 'Nyeri dada berat yang menjalar atau menekan kuat' },
    { id: 'alergi_berat', label: 'Reaksi alergi mendadak: bibir/lidah bengkak atau tenggorokan menyempit' },
    { id: 'perdarahan', label: 'Perdarahan hebat (mimisan sulit berhenti, muntah darah, BAB hitam)' },
    { id: 'leher_kaku', label: 'Demam tinggi disertai leher sangat kaku dan nyeri kepala hebat' },
    { id: 'muntah_parah', label: 'Muntah terus menerus hingga cairan tidak bisa masuk' },
  ];

  const categories = [
    { id: 'Demam & Gejala Umum', label: 'Demam & Meriang', desc: 'Suhu tubuh panas, menggigil, lemas' },
    { id: 'Kulit & Gatal Asrama', label: 'Kulit & Gatal Sela Jari', desc: 'Bintik merah, sela jari, skabies/kudis' },
    { id: 'Saluran Cerna & Perut', label: 'Perut & Pencernaan', desc: 'Maag, diare, mual, melilit' },
    { id: 'Pernapasan & Tenggorokan', label: 'Batuk, Pilek & Flu', desc: 'Radang tenggorokan, hidung tersumbat' },
    { id: 'Cedera & Otot/Sendi', label: 'Cedera & Nyeri Sendi', desc: 'Engkel terkilir, salah urat olahraga' },
    { id: 'Kepala & Mata', label: 'Sakit Kepala & Mata', desc: 'Pusing berputar, migrain, mata merah' },
  ];

  const handleToggleRedFlag = (id: string) => {
    setRedFlags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const hasAnyRedFlag = Object.values(redFlags).some(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasAnyRedFlag) {
      onEmergencyTrigger();
      return;
    }

    const checkedFlagsLabels = redFlagOptions
      .filter((rf) => redFlags[rf.id])
      .map((rf) => rf.label);

    const prompt = `Halo NADI, saya ingin melakukan evaluasi keluhan kesehatan di asrama:
- Kategori Keluhan: ${category}
- Keluhan Spesifik: ${complaintText || 'Mengalami gejala tidak enak badan di asrama'}
- Sejak Kapan / Durasi: ${duration}
- Skala Keparahan (1-10): ${severity} dari 10
- Tanda Bahaya yang Dialami: ${checkedFlagsLabels.length > 0 ? checkedFlagsLabels.join(', ') : 'Tidak ada tanda bahaya darurat yang tercentang'}
- Tindakan Awal di Asrama: ${actionsTaken || 'Istirahat di kasur kamar asrama'}

Mohon berikan analisis klinis dan panduan penanganan sesuai standar NADI Health Check.`;

    onSubmitTriage(prompt);
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6 no-print">
      {/* Title Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
            <FileHeart className="w-5 h-5 text-[#0D9488]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800 tracking-tight">
              Skrining Mandiri Terpandu
            </h1>
            <p className="text-xs text-slate-500">
              Formulir terstruktur untuk mempermudah evaluasi NADI dan petugas medis UKS.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-mono">
          <span>Identitas:</span>
          <span className="font-semibold text-slate-800">{studentProfile.name}</span>
          <span>•</span>
          <span>{studentProfile.grade}</span>
          <span>•</span>
          <span>{studentProfile.dormBuilding} ({studentProfile.dormRoom})</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Step 1: Category selection */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <label className="font-semibold uppercase tracking-wider text-slate-500 block text-[11px]">
            1. Pilih Kategori Keluhan:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  category === c.id
                    ? 'bg-[#0D9488] text-white border-[#0D9488]'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <p className="font-semibold">{c.label}</p>
                <p className={`text-[11px] mt-0.5 ${category === c.id ? 'text-teal-100' : 'text-slate-500'}`}>
                  {c.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Red flags check */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold uppercase tracking-wider text-zinc-500 block text-[11px]">
              2. Skrining Tanda Bahaya (Red Flags):
            </label>
            <span className="text-[11px] text-zinc-400">Centang jika kamu mengalaminya</span>
          </div>

          <div className="space-y-2">
            {redFlagOptions.map((rf) => {
              const checked = !!redFlags[rf.id];
              return (
                <button
                  key={rf.id}
                  type="button"
                  onClick={() => handleToggleRedFlag(rf.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-colors flex items-start gap-2.5 ${
                    checked
                      ? 'bg-red-50 border-red-300 text-red-950 font-medium'
                      : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                  }`}
                >
                  {checked ? (
                    <CheckSquare className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  )}
                  <span>{rf.label}</span>
                </button>
              );
            })}
          </div>

          {hasAnyRedFlag && (
            <div className="p-3.5 rounded-xl border border-red-300 bg-red-50 text-red-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-semibold text-xs">
                  Tanda bahaya terdeteksi! Sistem merekomendasikan penanganan darurat segera.
                </span>
              </div>
              <button
                type="button"
                onClick={onEmergencyTrigger}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shrink-0"
              >
                Panggil Bantuan SOS
              </button>
            </div>
          )}
        </div>

        {/* Step 3: Details & Duration */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <label className="font-semibold uppercase tracking-wider text-slate-500 block text-[11px]">
            3. Rincian Keluhan & Riwayat:
          </label>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Jelaskan apa yang kamu rasakan secara spesifik:
            </label>
            <textarea
              rows={3}
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              placeholder="Ceritakan rasa sakitnya, bagian tubuh mana yang sakit, apakah ada demam, batuk, pusing..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:border-[#0D9488] bg-white leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sejak Kapan Keluhan Muncul?
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white"
              >
                <option value="Kurang dari 6 jam yang lalu">Kurang dari 6 jam yang lalu</option>
                <option value="Hari ini (sejak pagi/siang)">Hari ini (sejak pagi/siang)</option>
                <option value="1–2 hari">1–2 hari</option>
                <option value="3–5 hari">3–5 hari</option>
                <option value="Lebih dari 1 minggu">Lebih dari 1 minggu</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Skala Rasa Sakit: <span className="font-mono">{severity} / 10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full accent-[#0D9488] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>1 (Ringan)</span>
                <span>5 (Sedang)</span>
                <span>10 (Tak Tertahankan)</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tindakan Awal yang Sudah Dilakukan di Kamar Asrama:
            </label>
            <input
              type="text"
              value={actionsTaken}
              onChange={(e) => setActionsTaken(e.target.value)}
              placeholder="misal: Minum air putih hangat, istirahat di tempat tidur kamar 204..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Kirim untuk Evaluasi Triase NADI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
