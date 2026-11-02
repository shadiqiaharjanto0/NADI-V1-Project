import React, { useState } from 'react';
import {
  GraduationCap,
  School,
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Building,
  ShieldAlert,
  UserPlus,
  LogIn,
  Loader2,
  Activity,
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { DEMO_USERS } from '../utils/storage';
import { registerWithSupabase, loginWithSupabase } from '../supabase';

interface InitialDashboardProps {
  onLogin: (user: AuthUser) => void;
  onOpenEmergency: () => void;
  currentUser?: AuthUser | null;
  onNavigateToRole?: () => void;
}

export const InitialDashboard: React.FC<InitialDashboardProps> = ({
  onLogin,
  onOpenEmergency,
  currentUser,
  onNavigateToRole,
}) => {
  // Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Login form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  // Sign Up form state (Supabase)
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('siswa');
  const [signUpGrade, setSignUpGrade] = useState('XII-1');
  const [signUpDormBuilding, setSignUpDormBuilding] = useState('Astra 1');
  const [signUpDormRoom, setSignUpDormRoom] = useState('204');
  const [signUpGender, setSignUpGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');

  const demoList = [
    {
      role: 'siswa' as UserRole,
      badge: 'AKUN SISWA / SISWI',
      title: 'Portal Siswa Boarding School',
      name: DEMO_USERS.siswa.name,
      identifier: DEMO_USERS.siswa.identifier,
      email: DEMO_USERS.siswa.email || 'shadiqiaharjanto0@gmail.com',
      password: DEMO_USERS.siswa.passwordHint,
      icon: GraduationCap,
      dorm: 'Asrama Astra 1 • Kelas XII-1 • Kamar 204',
      permissions: [
        'Skrining Interaktif Mandiri NADI AI',
        'Pelaporan Gejala & Buku Catatan Kesehatan Pribadi',
        'Ekspor Rekap Medis Pribadi ke File XLSX (Excel)',
        'Cetak Surat Pengantar & Lembar Rujukan UKS Resmi',
        'Panggilan Darurat Cepat Nasional (112, 119, 118, UKS)',
      ],
    },
    {
      role: 'pembina' as UserRole,
      badge: 'AKUN GURU / PEMBINA ASRAMA',
      title: 'Portal Guru & Pembina Asrama',
      name: DEMO_USERS.pembina.name,
      identifier: DEMO_USERS.pembina.identifier,
      email: DEMO_USERS.pembina.email || 'pembina@nadikita.sch.id',
      password: DEMO_USERS.pembina.passwordHint,
      icon: School,
      dorm: 'Pengawas Asrama Putra Astra 1 (Khusus Kelas XII)',
      permissions: [
        'Monitoring Seluruh Kamar & Siswa/Siswi yang Sakit',
        'Peringatan Real-Time Tanda Bahaya Darurat Medis Merah',
        'Verifikasi & Persetujuan Dispensasi KBM (Izin Kasur)',
        'Catatan Kunjungan Kamar & Pengawasan Sanitasi Kamar',
        'Ekspor Rekap Hunian & Kluster Asrama ke Format XLSX',
      ],
    },
    {
      role: 'nakes' as UserRole,
      badge: 'AKUN TENAGA MEDIS / UKS',
      title: 'Portal Medis & Pos Jaga UKS',
      name: DEMO_USERS.nakes.name,
      identifier: DEMO_USERS.nakes.identifier,
      email: DEMO_USERS.nakes.email || 'klinik.uks@nadi.sch.id',
      password: DEMO_USERS.nakes.passwordHint,
      icon: Stethoscope,
      dorm: 'Koordinator Pos Medis UKS & Klinik Sekolah 24 Jam',
      permissions: [
        'Antrean Pasien Rujukan Hasil Skrining Triase',
        'Pemeriksaan Tanda Vital & Resep Obat UKS',
        'Visualisasi Data Recharts Tren Kunjungan 6 Bulan',
        'Surveilans Dini Klaster Penularan (Skabies & ISPA)',
        'Ekspor Buku Register Kunjungan Lengkap ke XLSX',
      ],
    },
  ];

  // Copy credentials helper
  const handleCopyCredentials = (role: string, email: string, pass: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${pass}`);
    setCopiedRole(role);
    setTimeout(() => setCopiedRole(null), 2500);
  };

  // Form Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (!cleanEmail) {
      setErrorMessage('Silakan masukkan alamat email akun Anda.');
      setIsSubmitting(false);
      return;
    }

    if (!cleanPass) {
      setErrorMessage('Silakan masukkan kata sandi akun Anda.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Check matching demo accounts by email or username
      const matchedDemo = Object.values(DEMO_USERS).find(
        (u) =>
          u.email?.toLowerCase() === cleanEmail ||
          u.username.toLowerCase() === cleanEmail.split('@')[0]
      );

      if (matchedDemo) {
        if (cleanPass !== matchedDemo.passwordHint && cleanPass !== '123456' && cleanPass !== 'password') {
          setErrorMessage(`Kata sandi tidak sesuai untuk ${matchedDemo.email}. (Kredensial demo: ${matchedDemo.passwordHint})`);
          setIsSubmitting(false);
          return;
        }
        setSuccessMessage(`Berhasil masuk sebagai ${matchedDemo.name}`);
        setTimeout(() => {
          onLogin(matchedDemo);
        }, 300);
        return;
      }

      // 2. Authenticate via Supabase Auth & profiles table
      const authResult = await loginWithSupabase(cleanEmail, cleanPass);
      if (authResult.success && authResult.user) {
        setSuccessMessage(`Berhasil masuk ke Supabase sebagai ${authResult.user.name}`);
        setTimeout(() => {
          onLogin(authResult.user!);
        }, 300);
        return;
      }

      setErrorMessage(
        authResult.error ||
          'Email atau kata sandi tidak valid. Pastikan data yang dimasukkan sesuai kredensial demo atau akun yang didaftarkan.'
      );
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi gangguan saat melakukan autentikasi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form Submit Sign Up (Supabase Auth + profiles table)
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const cleanEmail = signUpEmail.trim().toLowerCase();
    const cleanPass = signUpPassword.trim();
    const cleanName = signUpFullName.trim();

    if (!cleanName) {
      setErrorMessage('Nama Lengkap wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    if (!cleanEmail) {
      setErrorMessage('Alamat email wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    if (cleanPass.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await registerWithSupabase({
        email: cleanEmail,
        password: cleanPass,
        fullName: cleanName,
        role: signUpRole,
        grade: signUpRole === 'siswa' ? signUpGrade : undefined,
        dormBuilding: signUpRole === 'siswa' ? signUpDormBuilding : undefined,
        dormRoom: signUpRole === 'siswa' ? signUpDormRoom : undefined,
        gender: signUpRole === 'siswa' ? signUpGender : undefined,
      });

      if (!result.success || !result.user) {
        setErrorMessage(result.error || 'Gagal mendaftarkan akun ke Supabase.');
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(
        `Akun ${cleanName} berhasil didaftarkan ke Supabase Auth dan disimpan ke tabel profiles!`
      );

      // Auto login into newly created account
      setTimeout(() => {
        onLogin(result.user!);
      }, 700);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan saat pendaftaran akun.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col no-print font-sans">
      {/* Top Bar */}
      <div className="border-b border-slate-200 bg-white py-2 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span className="font-semibold text-slate-900">Sistem NADI Aktif</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-slate-500 hidden sm:inline">
              Platform Kesehatan & Pengawasan Asrama Terpadu (Supabase Connected)
            </span>
          </div>
          <button
            onClick={onOpenEmergency}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 font-semibold text-xs transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Panggilan Darurat 119 / 112</span>
          </button>
        </div>
      </div>

      {/* Hero Section - Clinical Minimalist */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 text-center border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="inline-block text-xs font-mono font-bold tracking-wider text-[#0D9488] uppercase bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
            NADI Health Intelligence • Sistem Resmi Boarding School
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Kesehatan & Pengawasan Hunian Asrama Sekolah
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Sistem triase klinis mandiri siswa/siswi, pemantauan kamar asrama oleh pembina, dan register rekam medis klinik UKS terpadu dengan pembatasan hak akses ketat (Strict Role-Based Access Control).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-600">
            <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium">
              Protokol Triase Kemenkes RI
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium">
              Database Supabase Terhubung
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium">
              Ekspor Laporan XLSX / Sheets
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium">
              Cetak Dokumen Resmi PDF
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        {/* Active Session Notice if logged in */}
        {currentUser && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center font-bold shrink-0 border border-teal-200">
                <ShieldCheck className="w-5 h-5 text-[#0D9488]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  Sesi Aktif Terdaftar
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {currentUser.name} ({currentUser.role === 'siswa' ? 'Siswa / Siswi' : currentUser.role === 'pembina' ? 'Pembina Asrama' : 'Tenaga Medis UKS'})
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {currentUser.email || currentUser.username} • Hak akses terkunci pada peran ini.
                </p>
              </div>
            </div>

            {onNavigateToRole && (
              <button
                onClick={onNavigateToRole}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                <span>Buka Dasbor {currentUser.role === 'siswa' ? 'Siswa' : currentUser.role === 'pembina' ? 'Pembina' : 'Klinik UKS'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* SECTION 1: SYSTEM OVERVIEW / INTRODUKSI */}
        <section className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-[#0D9488] mb-1">
              <Activity className="w-4 h-4" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-teal-700">
                Overview & Introduksi Sistem
              </span>
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
              Rangkuman Menyeluruh Platform NADI Health Intelligence
            </h2>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Arsitektur terintegrasi pemantauan kesehatan asrama: triase mandiri siswa, pengawasan kamar pembina, dan rekam medis pos UKS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-zinc-600">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
              <h4 className="font-semibold text-zinc-900 text-sm">
                1. Identitas & Latar Belakang Masalah
              </h4>
              <p className="leading-relaxed">
                <strong>NADI (NADI Health Intelligence)</strong> adalah platform kesehatan preventif dan triase digital yang dirancang khusus untuk ekosistem <strong>SMA Boarding School</strong>. Di lingkungan asrama, siswa hidup berkelompok 24 jam dengan akses orang tua yang terbatas, sehingga penyakit menular (seperti <em>Skabies/Kudis</em>, <em>ISPA</em>, dan <em>Gastroenteritis</em>) mudah menyebar cepat antarkamar apabila tidak terdeteksi sedini mungkin.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
              <h4 className="font-semibold text-zinc-900 text-sm">
                2. Tiga Pilar Pengguna (Strict RBAC)
              </h4>
              <ul className="space-y-1.5 leading-relaxed">
                <li>• <strong>Siswa / Siswi:</strong> Melakukan skrining mandiri, mencatat keluhan di buku catatan kesehatan pribadi, mengunduh rekap pribadi XLSX, dan mencetak lembar rujukan UKS.</li>
                <li>• <strong>Guru & Pembina Asrama:</strong> Memantau kamar-kamar hunian (Astra 1-3, Astri 1-3), memverifikasi dispensasi KBM izin kasur, dan mengekspor rekap sakit asrama ke XLSX.</li>
                <li>• <strong>Tenaga Medis UKS:</strong> Mengelola antrean klinis hasil triase AI, input pemeriksaan tanda vital, terapi obat, observasi ranjang rawat, dan analisis tren.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
              <h4 className="font-semibold text-zinc-900 text-sm">
                3. Tiga Tingkat Urgensi Triase Medis
              </h4>
              <ul className="space-y-1 leading-relaxed">
                <li>• <strong className="text-emerald-700">Level 1 (Hijau):</strong> Observasi & perawatan awal mandiri di asrama (keluhan ringan, hidrasi, istirahat).</li>
                <li>• <strong className="text-amber-700">Level 2 (Kuning):</strong> Penilaian petugas UKS pada hari yang sama (keluhan mengganggu atau berpotensi menular).</li>
                <li>• <strong className="text-red-700">Level 3 (Merah):</strong> Kegawatdaruratan medis, segera dampingi & evakuasi ke IGD RSUD serta aktifkan hotline darurat 119/112.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
              <h4 className="font-semibold text-zinc-900 text-sm">
                4. Visualisasi Data Recharts & Peringatan Klaster
              </h4>
              <p className="leading-relaxed">
                Dasbor Nakes dilengkapi dengan <strong>Visualisasi Data Recharts 6 Bulan</strong> (Batang Bertumpuk & Garis Tren) untuk melacak 5 kategori keluhan asrama (ISPA, Pencernaan, Kulit/Skabies, Cedera, Kelelahan). Sistem secara otomatis menghitung <strong>Algoritma Klaster Kamar</strong> saat ≥2 siswa/siswi dalam kamar yang sama jatuh sakit.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: OFFICIAL LOGIN & SIGNUP (SUPABASE INTEGRATED) */}
        <section id="login-form-section" className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
            <div>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500 block mb-0.5">
                Autentikasi Terintegrasi Supabase
              </span>
              <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
                {authMode === 'login' ? 'Masuk ke Sistem NADI' : 'Daftar Akun Baru (Supabase)'}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {authMode === 'login'
                  ? 'Akses terkunci: masukkan alamat email dan kata sandi akun demo atau akun yang telah didaftarkan.'
                  : 'Daftarkan pengguna baru. Data Nama Lengkap dan Role otomatis tersimpan ke tabel profiles di Supabase.'}
              </p>
            </div>

            {/* Segmented Auth Mode Switch */}
            <div className="flex items-center bg-zinc-100 p-1 rounded-xl text-xs font-medium shrink-0">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  authMode === 'login' ? 'bg-white text-zinc-900 font-semibold shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Akun</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  authMode === 'signup' ? 'bg-white text-zinc-900 font-semibold shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Daftar Akun (Supabase)</span>
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5 max-w-xl mx-auto">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 max-w-xl mx-auto">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE 1: LOGIN FORM */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-xl mx-auto text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Alamat Email Akun:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="shadiqiaharjanto0@gmail.com, pembina@nadikita.sch.id, atau email terdaftar"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-900 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs"
                    required
                  />
                </div>
                <p className="text-[11px] text-zinc-500 font-mono mt-1">
                  Masukkan email akun demo dari kartu di bawah atau email akun Supabase yang sudah didaftarkan.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-zinc-700">
                    Kata Sandi:
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[#0D9488] hover:underline flex items-center gap-1"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Sembunyikan
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Lihat Sandi
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:border-[#0D9488] bg-white text-xs"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-1">
                  Contoh kata sandi demo: <span className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">shadiqia123</span> (Siswa), <span className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">pembina123</span> (Pembina), <span className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">nakes123</span> (Nakes)
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi Akun...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Dasbor NADI</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-xs text-[#0D9488] hover:underline"
                >
                  Belum punya akun? Daftarkan akun baru ke Supabase di sini.
                </button>
              </div>
            </form>
          ) : (
            /* MODE 2: SIGN UP FORM (SUPABASE AUTH + PROFILES TABLE) */
            <form onSubmit={handleSignUpSubmit} className="space-y-4 max-w-xl mx-auto text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Nama Lengkap: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={signUpFullName}
                  onChange={(e) => setSignUpFullName(e.target.value)}
                  placeholder="Contoh: Shadiqia Fattaraditya Harjanto"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-zinc-900 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Alamat Email: <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="email.aktif@sekolah.sch.id"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-900 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-zinc-700">
                    Kata Sandi: <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[#0071E3] hover:underline flex items-center gap-1"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Sembunyikan
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Lihat Sandi
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Minimal 6 karakter..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-900 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Role Selection: 'siswa', 'nakes', or 'pembina' as requested */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1.5">
                  Pilih Role Pengguna: <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSignUpRole('siswa')}
                    className={`p-3 rounded-xl border text-left transition-colors flex flex-col gap-1 ${
                      signUpRole === 'siswa'
                        ? 'border-[#0D9488] bg-teal-50 text-[#0D9488]'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-semibold text-xs">Siswa</span>
                    <span className="text-[10px] text-slate-500">Skrining & Catatan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignUpRole('pembina')}
                    className={`p-3 rounded-xl border text-left transition-colors flex flex-col gap-1 ${
                      signUpRole === 'pembina'
                        ? 'border-[#0D9488] bg-teal-50 text-[#0D9488]'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <School className="w-4 h-4" />
                    <span className="font-semibold text-xs">Pembina</span>
                    <span className="text-[10px] text-slate-500">Pengawasan Kamar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignUpRole('nakes')}
                    className={`p-3 rounded-xl border text-left transition-colors flex flex-col gap-1 ${
                      signUpRole === 'nakes'
                        ? 'border-[#0D9488] bg-teal-50 text-[#0D9488]'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span className="font-semibold text-xs">Tenaga Medis</span>
                    <span className="text-[10px] text-slate-500">Klinik UKS & Triase</span>
                  </button>
                </div>
              </div>

              {/* Specific fields if siswa */}
              {signUpRole === 'siswa' && (
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider block font-mono">
                    Detail Siswa & Penempatan Asrama
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-600 text-[11px] mb-1">Tingkat Kelas & Rombel:</label>
                      <select
                        value={signUpGrade}
                        onChange={(e) => setSignUpGrade(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 bg-white text-xs text-zinc-900"
                      >
                        <optgroup label="Kelas XII (Rombel 1 - 4)">
                          <option value="XII-1">XII-1</option>
                          <option value="XII-2">XII-2</option>
                          <option value="XII-3">XII-3</option>
                          <option value="XII-4">XII-4</option>
                        </optgroup>
                        <optgroup label="Kelas XI (Rombel 1 - 6)">
                          <option value="XI-1">XI-1</option>
                          <option value="XI-2">XI-2</option>
                          <option value="XI-3">XI-3</option>
                          <option value="XI-4">XI-4</option>
                          <option value="XI-5">XI-5</option>
                          <option value="XI-6">XI-6</option>
                        </optgroup>
                        <optgroup label="Kelas X (Rombel 1 - 6)">
                          <option value="X-1">X-1</option>
                          <option value="X-2">X-2</option>
                          <option value="X-3">X-3</option>
                          <option value="X-4">X-4</option>
                          <option value="X-5">X-5</option>
                          <option value="X-6">X-6</option>
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-600 text-[11px] mb-1">Gedung Asrama:</label>
                      <select
                        value={signUpDormBuilding}
                        onChange={(e) => setSignUpDormBuilding(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 bg-white text-xs text-zinc-900"
                      >
                        <option value="Astra 1">Astra 1 (Asrama Putra Kelas XII)</option>
                        <option value="Astra 2">Astra 2 (Asrama Putra Kelas XI)</option>
                        <option value="Astra 3">Astra 3 (Asrama Putra Kelas X)</option>
                        <option value="Astri 1">Astri 1 (Asrama Putri Kelas XII)</option>
                        <option value="Astri 2">Astri 2 (Asrama Putri Kelas XI)</option>
                        <option value="Astri 3">Astri 3 (Asrama Putri Kelas X)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-600 text-[11px] mb-1">Nomor Kamar:</label>
                      <input
                        type="text"
                        value={signUpDormRoom}
                        onChange={(e) => setSignUpDormRoom(e.target.value)}
                        placeholder="Contoh: 204"
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 bg-white text-xs text-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-600 text-[11px] mb-1">Jenis Kelamin:</label>
                      <select
                        value={signUpGender}
                        onChange={(e) => setSignUpGender(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 bg-white text-xs text-zinc-900"
                      >
                        <option value="Laki-laki">Laki-laki (Siswa)</option>
                        <option value="Perempuan">Perempuan (Siswi)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mendaftarkan ke Supabase Auth & Profiles...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Daftarkan Akun ke Supabase</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-[#0D9488] hover:underline"
                >
                  Sudah punya akun? Masuk menggunakan email & kata sandi di sini.
                </button>
              </div>
            </form>
          )}
        </section>

        {/* SECTION 3: 3 OFFICIAL DEMO ACCOUNTS (CREDENTIALS DISPLAY ONLY - NO 1-CLICK BYPASS) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200 pb-3">
            <div>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                Otorisasi Berbasis Peran (RBAC)
              </span>
              <h2 className="text-xl font-semibold text-zinc-900 tracking-tight mt-0.5">
                Kredensial Tiga Akun Demo Resmi
              </h2>
            </div>
            <p className="text-xs text-zinc-500">
              Setiap jenis akun memiliki batasan akses terisolasi. Salin kredensial di bawah dan masukkan manual ke formulir di atas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {demoList.map((demo) => {
              const Icon = demo.icon;
              return (
                <div
                  key={demo.role}
                  className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col justify-between hover:border-zinc-300 transition-colors shadow-xs"
                >
                  <div className="space-y-3.5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 uppercase">
                        {demo.badge}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-zinc-900">
                        {demo.name}
                      </h3>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">
                        {demo.identifier}
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1 font-mono">
                        <Building className="w-3 h-3 text-zinc-400" />
                        <span>{demo.dorm}</span>
                      </p>
                    </div>

                    {/* Credentials Box */}
                    <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase text-zinc-500">Email:</span>
                        <span className="font-semibold text-zinc-900 text-[11px]">{demo.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase text-zinc-500">Password:</span>
                        <span className="font-semibold text-zinc-800 text-[11px] bg-zinc-200 px-1.5 py-0.5 rounded">
                          {demo.password}
                        </span>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div className="space-y-1.5 pt-1 text-xs">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
                        Hak Akses Terisolasi:
                      </span>
                      <ul className="space-y-1 text-zinc-600 text-xs">
                        {demo.permissions.map((perm, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                            <span>{perm}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions - Manual copy only, NO 1-click login */}
                  <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Autentikasi manual
                    </span>
                    <button
                      onClick={() => handleCopyCredentials(demo.role, demo.email, demo.password)}
                      className="py-1.5 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium flex items-center gap-1.5 transition-colors border border-zinc-200"
                      title="Salin Email & Password"
                    >
                      {copiedRole === demo.role ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Kredensial Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Kredensial</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
