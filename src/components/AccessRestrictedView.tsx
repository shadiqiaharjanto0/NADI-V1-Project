import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { AuthUser } from '../types';

interface AccessRestrictedViewProps {
  currentUser: AuthUser | null;
  targetViewName: string;
  onReturnToAllowed: () => void;
  onLogout: () => void;
}

export const AccessRestrictedView: React.FC<AccessRestrictedViewProps> = ({
  currentUser,
  targetViewName,
  onReturnToAllowed,
  onLogout,
}) => {
  const roleTitle =
    currentUser?.role === 'siswa'
      ? 'Siswa / Siswi'
      : currentUser?.role === 'pembina'
      ? 'Guru & Pembina Asrama'
      : currentUser?.role === 'nakes'
      ? 'Tenaga Medis UKS'
      : 'Tamu / Belum Masuk';

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[#FBFBFD]">
      <div className="max-w-md w-full bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-800 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6 text-zinc-700" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200">
            HTTP 403 • Akses Terbatas
          </span>
          <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">
            Otorisasi Akses Dibatasi
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Anda sedang masuk dengan akun <strong className="text-zinc-800">{currentUser?.name || 'Pengguna'}</strong> berkategori <strong className="text-zinc-800">{roleTitle}</strong>. Peran ini tidak memiliki hak otorisasi untuk membuka modul <span className="font-semibold text-zinc-800">{targetViewName}</span>.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 text-left space-y-1">
          <p className="font-semibold text-zinc-800">Kebijakan Privasi & Batasan Akses:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Siswa hanya berhak mengakses rekam medis pribadi dan skrining mandiri.</li>
            <li>Panel pemantauan asrama dan klinik UKS dilindungi kontrol akses berbasis peran (RBAC).</li>
            <li>Untuk berpindah akun, silakan keluar terlebih dahulu secara resmi.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <button
            onClick={onReturnToAllowed}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#0071E3] hover:bg-blue-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dasbor Saya</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-zinc-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
};
