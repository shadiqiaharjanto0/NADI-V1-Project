import React, { useState, useEffect } from 'react';
import { X, Save, User, Building, Phone, ShieldCheck } from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSave: (updated: StudentProfile) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-200">
              <User className="w-4 h-4 text-[#0D9488]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-800">Profil Siswa & Data Asrama</h3>
              <p className="text-xs text-slate-500">
                Data lokal untuk rujukan UKS & kontak darurat
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-zinc-800">
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-600 flex items-start gap-2.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <span>
              Data privasi kesehatanmu tersimpan aman di browser lokal dan hanya disertakan saat kamu melakukan skrining atau mencetak lembar rujukan UKS.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="font-semibold text-zinc-700 block mb-1">
                Nama Lengkap Siswa:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">
                Jenis Kelamin:
              </label>
              <select
                value={formData.gender}
                onChange={(e) => {
                  const newGender = e.target.value as 'Laki-laki' | 'Perempuan';
                  let newDorm = formData.dormBuilding;
                  if (formData.grade.startsWith('XII')) {
                    newDorm = newGender === 'Laki-laki' ? 'Astra 1' : 'Astri 1';
                  } else if (formData.grade.startsWith('XI')) {
                    newDorm = newGender === 'Laki-laki' ? 'Astra 2' : 'Astri 2';
                  } else {
                    newDorm = newGender === 'Laki-laki' ? 'Astra 3' : 'Astri 3';
                  }
                  setFormData({
                    ...formData,
                    gender: newGender,
                    dormBuilding: newDorm,
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs"
              >
                <option value="Laki-laki">Laki-laki (Siswa Putra - Astra)</option>
                <option value="Perempuan">Perempuan (Siswi Putri - Astri)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">
                Kelas / Rombel:
              </label>
              <select
                value={formData.grade}
                onChange={(e) => {
                  const newGrade = e.target.value;
                  let autoDorm = formData.dormBuilding;
                  const isMale = formData.gender === 'Laki-laki';
                  if (newGrade.startsWith('XII')) {
                    autoDorm = isMale ? 'Astra 1' : 'Astri 1';
                  } else if (newGrade.startsWith('XI')) {
                    autoDorm = isMale ? 'Astra 2' : 'Astri 2';
                  } else {
                    autoDorm = isMale ? 'Astra 3' : 'Astri 3';
                  }
                  setFormData({
                    ...formData,
                    grade: newGrade,
                    dormBuilding: autoDorm,
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs font-medium"
              >
                <optgroup label="Kelas XII (4 Rombel)">
                  <option value="XII-1">Kelas XII-1</option>
                  <option value="XII-2">Kelas XII-2</option>
                  <option value="XII-3">Kelas XII-3</option>
                  <option value="XII-4">Kelas XII-4</option>
                </optgroup>
                <optgroup label="Kelas XI (6 Rombel)">
                  <option value="XI-1">Kelas XI-1</option>
                  <option value="XI-2">Kelas XI-2</option>
                  <option value="XI-3">Kelas XI-3</option>
                  <option value="XI-4">Kelas XI-4</option>
                  <option value="XI-5">Kelas XI-5</option>
                  <option value="XI-6">Kelas XI-6</option>
                </optgroup>
                <optgroup label="Kelas X (6 Rombel)">
                  <option value="X-1">Kelas X-1</option>
                  <option value="X-2">Kelas X-2</option>
                  <option value="X-3">Kelas X-3</option>
                  <option value="X-4">Kelas X-4</option>
                  <option value="X-5">Kelas X-5</option>
                  <option value="X-6">Kelas X-6</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">
                Gedung Asrama:
              </label>
              <select
                value={formData.dormBuilding}
                onChange={(e) =>
                  setFormData({ ...formData, dormBuilding: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs font-medium"
              >
                <optgroup label="Asrama Putra (Astra)">
                  <option value="Astra 1">Astra 1 (Putra - Kelas XII)</option>
                  <option value="Astra 2">Astra 2 (Putra - Kelas XI)</option>
                  <option value="Astra 3">Astra 3 (Putra - Kelas X)</option>
                </optgroup>
                <optgroup label="Asrama Putri (Astri)">
                  <option value="Astri 1">Astri 1 (Putri - Kelas XII)</option>
                  <option value="Astri 2">Astri 2 (Putri - Kelas XI)</option>
                  <option value="Astri 3">Astri 3 (Putri - Kelas X)</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">
                Nomor Kamar:
              </label>
              <input
                type="text"
                placeholder="misal: Kamar 204"
                value={formData.dormRoom}
                onChange={(e) =>
                  setFormData({ ...formData, dormRoom: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-zinc-700 block mb-1">
                Riwayat Alergi / Kondisi Khusus:
              </label>
              <input
                type="text"
                placeholder="misal: Alergi amoksisilin, asma saat dingin, dll."
                value={formData.allergies}
                onChange={(e) =>
                  setFormData({ ...formData, allergies: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs"
              />
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-zinc-200">
              <h4 className="font-semibold text-zinc-900 mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>Kontak Pembina & Hotline UKS</span>
              </h4>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">
                Nama Pembina Asrama:
              </label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyContactName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">
                No. Telp Pembina:
              </label>
              <input
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyContactPhone: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs font-mono tabular-nums"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-zinc-700 block mb-1">
                No. Telepon Pos Medis UKS:
              </label>
              <input
                type="tel"
                value={formData.uksContactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, uksContactPhone: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs font-mono tabular-nums"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
