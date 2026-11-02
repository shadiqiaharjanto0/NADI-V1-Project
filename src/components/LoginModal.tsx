import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Stethoscope,
  GraduationCap,
  ArrowRight,
  School,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { DEMO_USERS } from '../utils/storage';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
  currentUser: AuthUser | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser?.role || 'siswa');
  const [emailInput, setEmailInput] = useState(DEMO_USERS[currentUser?.role || 'siswa'].email || '');
  const [passwordInput, setPasswordInput] = useState(DEMO_USERS[currentUser?.role || 'siswa'].passwordHint);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleTabClick = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    setSuccessMessage('');
    const demo = DEMO_USERS[role];
    setEmailInput(demo.email || `${demo.username}@nadi.sch.id`);
    setPasswordInput(demo.passwordHint);
  };

  const handleOneClickDemo = (role: UserRole) => {
    const user = DEMO_USERS[role];
    setSuccessMessage(`Masuk sebagai ${user.name}`);
    setTimeout(() => {
      onLogin(user);
      onClose();
    }, 250);
  };

  const handleCopyCredentials = (role: string, email: string, pass: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${pass}`);
    setCopiedRole(role);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (!cleanEmail) {
      setErrorMessage('Alamat email wajib diisi.');
      return;
    }

    if (!cleanPass) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    // Check if matches demo user
    const matchedDemo = Object.values(DEMO_USERS).find(
      (u) =>
        u.email?.toLowerCase() === cleanEmail ||
        u.username.toLowerCase() === cleanEmail.split('@')[0]
    );

    if (matchedDemo) {
      if (cleanPass !== matchedDemo.passwordHint && cleanPass !== '123456' && cleanPass !== 'password') {
        setErrorMessage(`Kata sandi salah untuk ${matchedDemo.email}. (Gunakan: ${matchedDemo.passwordHint})`);
        return;
      }
      setSuccessMessage(`Berhasil masuk sebagai ${matchedDemo.name}`);
      setTimeout(() => {
        onLogin(matchedDemo);
        onClose();
      }, 250);
      return;
    }

    // Check Supabase and local accounts
    try {
      const { loginWithSupabase } = await import('../supabase');
      const sbResult = await loginWithSupabase(cleanEmail, cleanPass);
      if (sbResult.success && sbResult.user) {
        setSuccessMessage(`Berhasil masuk sebagai ${sbResult.user.name}`);
        setTimeout(() => {
          onLogin(sbResult.user!);
          onClose();
        }, 250);
        return;
      }
    } catch (e) {
      console.warn('Supabase login check:', e);
    }

    setErrorMessage('Email atau kata sandi salah. Gunakan kredensial demo atau akun yang telah didaftarkan.');
  };

  const roleMeta = {
    siswa: {
      title: 'Portal Siswa / Siswi',
      badge: 'Siswa Kelas XII-1 • Astra 1',
      icon: GraduationCap,
      desc: 'Skrining awal mandiri, buku catatan keluhan pribadi, dan lembar rujukan resmi ke UKS.',
      demoAccount: DEMO_USERS.siswa,
    },
    pembina: {
      title: 'Portal Guru & Pembina Asrama',
      badge: 'Wali Asrama Astra 1',
      icon: School,
      desc: 'Pantau status hunian seluruh kamar asrama, notifikasi gawat darurat, dan verifikasi dispensasi izin istirahat KBM.',
      demoAccount: DEMO_USERS.pembina,
    },
    nakes: {
      title: 'Portal Tenaga Medis UKS',
      badge: 'Dokter / Perawat UKS',
      icon: Stethoscope,
      desc: 'Antrean pemeriksaan klinis, resep obat UKS, visualisasi tren kunjungan 6 bulan, dan investigasi klaster.',
      demoAccount: DEMO_USERS.nakes,
    },
  };

  const currentMeta = roleMeta[selectedRole];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-zinc-200 overflow-hidden my-6">
        {/* Apple Minimalist Header */}
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
              Masuk Sistem NADI Health Intelligence
            </h3>
            <p className="text-xs text-zinc-500">
              Pilih ruang kerja dan masukkan kredensial terdaftar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Role Segmented Selector */}
          <div className="grid grid-cols-3 gap-1 bg-zinc-100 p-1 rounded-xl font-medium">
            {(['siswa', 'pembina', 'nakes'] as UserRole[]).map((r) => {
              const Icon = roleMeta[r].icon;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleTabClick(r)}
                  className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    selectedRole === r
                      ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="capitalize">{r === 'nakes' ? 'Medis' : r}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Demo Access Card */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">
                  Akun Demo Resmi:
                </span>
                <p className="text-xs font-semibold text-zinc-900">
                  {currentMeta.demoAccount.name}
                </p>
                <p className="text-[11px] text-zinc-500 font-mono">
                  {currentMeta.badge}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCredentials(selectedRole, currentMeta.demoAccount.email || '', currentMeta.demoAccount.passwordHint)}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-medium text-xs transition-colors shrink-0 flex items-center gap-1"
                title="Salin Email & Password"
              >
                {copiedRole === selectedRole ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-zinc-600 leading-relaxed pt-1 border-t border-zinc-200">
              {currentMeta.desc}
            </p>
          </div>

          {/* Messages */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Alamat Email Pengguna:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="email@sekolah.sch.id"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-300 text-zinc-900 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-zinc-700">
                  Kata Sandi:
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#0D9488] hover:underline"
                >
                  {showPassword ? 'Sembunyikan' : 'Lihat Sandi'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Kata sandi..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:border-[#0D9488] bg-white text-xs"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleCopyCredentials(selectedRole, currentMeta.demoAccount.email || '', currentMeta.demoAccount.passwordHint)}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-mono"
              >
                {copiedRole === selectedRole ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Kredensial Demo</span>
                  </>
                )}
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Masuk Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
