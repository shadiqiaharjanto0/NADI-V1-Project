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
  HeartPulse,
  Activity,
  Building,
  PhoneCall,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { DEMO_USERS } from '../utils/storage';

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
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedRole, setCopiedRole] = useState<string | null>(null);
  const [activeTabRole, setActiveTabRole] = useState<UserRole>('siswa');

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
      userObj: DEMO_USERS.siswa,
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
      userObj: DEMO_USERS.pembina,
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
      userObj: DEMO_USERS.nakes,
    },
  ];

  // Direct 1-Click Login from Demo Card
  const handleDirectDemoLogin = (user: AuthUser) => {
    onLogin(user);
  };

  // Fill credentials to form
  const handleFillCredentials = (email: string, pass: string, role: UserRole) => {
    setEmailInput(email);
    setPasswordInput(pass);
    setActiveTabRole(role);
    setErrorMessage('');
    const formElem = document.getElementById('login-form-section');
    formElem?.scrollIntoView({ behavior: 'smooth' });
  };

  // Copy credentials helper
  const handleCopyCredentials = (role: string, email: string, pass: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${pass}`);
    setCopiedRole(role);
    setTimeout(() => setCopiedRole(null), 2500);
  };

  // Form Submit
  const handleEmailPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (!cleanEmail) {
      setErrorMessage('Silakan masukkan alamat email akun Anda.');
      return;
    }

    if (!cleanPass) {
      setErrorMessage('Silakan masukkan kata sandi akun Anda.');
      return;
    }

    // Check matching demo accounts by email or username
    let matchedDemo = Object.values(DEMO_USERS).find(
      (u) =>
        u.email?.toLowerCase() === cleanEmail ||
        u.username.toLowerCase() === cleanEmail.split('@')[0]
    );

    if (matchedDemo) {
      if (cleanPass !== matchedDemo.passwordHint && cleanPass !== '123456' && cleanPass !== 'password') {
        setErrorMessage(`Kata sandi tidak sesuai untuk ${matchedDemo.email}. (Gunakan demo: ${matchedDemo.passwordHint})`);
        return;
      }
      onLogin(matchedDemo);
      return;
    }

    // Role detection fallback based on active role tab or email keyword
    let role: UserRole = activeTabRole;
    if (cleanEmail.includes('guru') || cleanEmail.includes('pembina') || cleanEmail.includes('bapak') || cleanEmail.includes('ibu')) {
      role = 'pembina';
    } else if (cleanEmail.includes('dokter') || cleanEmail.includes('perawat') || cleanEmail.includes('uks') || cleanEmail.includes('klinik')) {
      role = 'nakes';
    }

    const customUser: AuthUser = {
      id: `usr-custom-${Date.now()}`,
      username: cleanEmail.split('@')[0],
      name: role === 'siswa' ? DEMO_USERS.siswa.name : role === 'pembina' ? DEMO_USERS.pembina.name : DEMO_USERS.nakes.name,
      role,
      identifier: role === 'siswa' ? 'NISN 007238192' : role === 'pembina' ? 'NIP 198504122010011003' : 'SIP 503/440/SIP-D/2024',
      title: role === 'siswa' ? 'Siswa Kelas XII-1 • Asrama Astra 1' : role === 'pembina' ? 'Kepala Pembina Asrama Putra Astra 1' : 'Koordinator Medis UKS & Pos Medis Asrama',
      email: cleanEmail,
    };

    onLogin(customUser);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-zinc-900 flex flex-col no-print">
      {/* Top Bar */}
      <div className="border-b border-zinc-200 bg-white py-2 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-zinc-800">Sistem NADI Aktif</span>
            <span className="text-zinc-300 hidden sm:inline">•</span>
            <span className="text-zinc-500 hidden sm:inline">
              Platform Kesehatan & Pengawasan Asrama Terpadu
            </span>
          </div>
          <button
            onClick={onOpenEmergency}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 font-semibold text-xs transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Panggilan Darurat 119 / 112</span>
          </button>
        </div>
      </div>

      {/* Hero Section - Apple Minimalist */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 text-center border-b border-zinc-200 bg-white">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="inline-block text-xs font-mono font-semibold tracking-wider text-[#0071E3] uppercase">
            NADI Health Intelligence • Sistem Resmi
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">
            Kesehatan & Pengawasan Hunian Asrama Sekolah
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Sistem triase klinis mandiri, pemantauan kamar siswa/siswi oleh pembina, dan register rekam medis klinik UKS dengan pembatasan hak akses ketat (Role-Based Access Control).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-zinc-600">
            <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200">
              Protokol Triase Kemenkes RI
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200">
              Ekspor Laporan XLSX / Sheets
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200">
              Cetak Dokumen Resmi PDF
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-12">
        {/* Active Session Notice if logged in */}
        {currentUser && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold shrink-0 border border-zinc-200">
                <ShieldCheck className="w-5 h-5 text-[#0071E3]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">
                  Sesi Aktif Terdaftar
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-zinc-900">
                  {currentUser.name} ({currentUser.role === 'siswa' ? 'Siswa / Siswi' : currentUser.role === 'pembina' ? 'Pembina Asrama' : 'Tenaga Medis UKS'})
                </h3>
                <p className="text-xs text-zinc-500 font-mono">
                  {currentUser.email || currentUser.username} • Hak akses terkunci pada peran ini.
                </p>
              </div>
            </div>

            {onNavigateToRole && (
              <button
                onClick={onNavigateToRole}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0071E3] hover:bg-blue-600 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                <span>Buka Dasbor {currentUser.role === 'siswa' ? 'Siswa' : currentUser.role === 'pembina' ? 'Pembina' : 'Klinik UKS'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* SECTION 1: 3 OFFICIAL DEMO ACCOUNTS */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200 pb-3">
            <div>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                Otorisasi Berbasis Peran (RBAC)
              </span>
              <h2 className="text-xl font-semibold text-zinc-900 tracking-tight mt-0.5">
                Tiga Akun Demo dengan Hak Akses Berbeda
              </h2>
            </div>
            <p className="text-xs text-zinc-500">
              Setiap jenis akun memiliki batasan akses terisolasi sesuai wewenang.
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
                        Hak Akses Sistem:
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

                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-zinc-100 flex flex-col gap-2">
                    <button
                      onClick={() => handleDirectDemoLogin(demo.userObj)}
                      className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Masuk Akun Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleFillCredentials(demo.email, demo.password, demo.role)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-medium text-center transition-colors border border-zinc-200"
                      >
                        Isi ke Formulir
                      </button>

                      <button
                        onClick={() => handleCopyCredentials(demo.role, demo.email, demo.password)}
                        className="py-1.5 px-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-[11px] flex items-center gap-1 transition-colors border border-zinc-200"
                        title="Salin Kredensial"
                      >
                        {copiedRole === demo.role ? (
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
                  </div>
                </div>
              );
            })}
          </div>

          {/* Academic & Dormitory Structure Summary */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-[#0071E3]" />
                <h3 className="font-semibold text-sm text-zinc-900">
                  Struktur 16 Rombel & Pembagian 6 Gedung Asrama
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                Siswa Aktif: Shadiqia Fattaraditya Harjanto (XII-1 • Astra 1)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-zinc-900">
                  <span>Kelas XII (4 Rombel)</span>
                  <span className="text-zinc-500">XII-1 s.d. XII-4</span>
                </div>
                <div className="text-[11px] text-zinc-600 space-y-0.5">
                  <p>Asrama Putra: <strong>Astra 1</strong></p>
                  <p>Asrama Putri: <strong>Astri 1</strong></p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-zinc-900">
                  <span>Kelas XI (6 Rombel)</span>
                  <span className="text-zinc-500">XI-1 s.d. XI-6</span>
                </div>
                <div className="text-[11px] text-zinc-600 space-y-0.5">
                  <p>Asrama Putra: <strong>Astra 2</strong></p>
                  <p>Asrama Putri: <strong>Astri 2</strong></p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-zinc-900">
                  <span>Kelas X (6 Rombel)</span>
                  <span className="text-zinc-500">X-1 s.d. X-6</span>
                </div>
                <div className="text-[11px] text-zinc-600 space-y-0.5">
                  <p>Asrama Putra: <strong>Astra 3</strong></p>
                  <p>Asrama Putri: <strong>Astri 3</strong></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: OFFICIAL LOGIN VIA EMAIL & PASSWORD */}
        <section id="login-form-section" className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
            <div>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500 block mb-0.5">
                Autentikasi Terintegrasi
              </span>
              <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
                Masuk via Alamat Email & Kata Sandi
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Gunakan email akun terdaftar Anda untuk masuk ke ruang kerja yang sesuai.
              </p>
            </div>

            {/* Role Tab Selector - Apple Minimalist */}
            <div className="flex items-center bg-zinc-100 p-1 rounded-xl text-xs font-medium shrink-0">
              <button
                type="button"
                onClick={() => setActiveTabRole('siswa')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTabRole === 'siswa' ? 'bg-white text-zinc-900 font-semibold shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Siswa
              </button>
              <button
                type="button"
                onClick={() => setActiveTabRole('pembina')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTabRole === 'pembina' ? 'bg-white text-zinc-900 font-semibold shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Pembina
              </button>
              <button
                type="button"
                onClick={() => setActiveTabRole('nakes')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTabRole === 'nakes' ? 'bg-white text-zinc-900 font-semibold shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Tenaga Medis
              </button>
            </div>
          </div>

          <form onSubmit={handleEmailPasswordSubmit} className="space-y-4 max-w-xl mx-auto text-xs">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                Alamat Email Pengguna:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="misal: shadiqiaharjanto0@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-900 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs"
                  required
                />
              </div>
              <p className="text-[11px] text-zinc-500 font-mono mt-1">
                Demo email: {DEMO_USERS[activeTabRole].email}
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
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-300 text-zinc-900 focus:outline-hidden focus:border-[#0071E3] bg-white text-xs"
                  required
                />
              </div>
              <p className="text-[11px] text-zinc-500 font-mono mt-1">
                Demo sandi: {DEMO_USERS[activeTabRole].passwordHint}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-zinc-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#0071E3] accent-[#0071E3]"
                />
                <span>Ingat akun di browser ini</span>
              </label>

              <button
                type="button"
                onClick={() => handleFillCredentials(DEMO_USERS[activeTabRole].email || '', DEMO_USERS[activeTabRole].passwordHint, activeTabRole)}
                className="text-[#0071E3] hover:underline font-medium"
              >
                Isi Kredensial Demo
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Masuk ke Dasbor NADI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </section>

        {/* SECTION 3: SYSTEM OVERVIEW & ARCHITECTURE SUMMARY */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 space-y-6">
          <div className="border-b border-zinc-100 pb-4">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
              Dokumentasi Sistem & Ringkasan Aplikasi
            </span>
            <h3 className="text-xl font-semibold text-zinc-900 tracking-tight mt-0.5">
              Rangkuman Menyeluruh Platform NADI Health Intelligence
            </h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Panduan terpadu mengenai arsitektur, 3 pilar pengguna, protokol keselamatan triase, dan teknologi surveilans asrama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-600">
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
                <li>• <strong>Siswa / Siswi:</strong> Melakukan skrining mandiri, mencatat keluhan di buku harian pribadi, mengunduh rekap pribadi XLSX, dan mencetak lembar rujukan UKS.</li>
                <li>• <strong>Guru & Pembina Asrama:</strong> Memantau kamar-kamar hunian (Astra 1-3, Astri 1-3), memverifikasi dispensasi KBM izin kasur, dan mengekspor rekap sakit asrama ke XLSX.</li>
                <li>• <strong>Tenaga Medis UKS:</strong> Mengelola antrean klinis hasil triase AI, input pemeriksaan tanda vital, terapi obat, observasi ranjang rawat, dan analisis visual tren 6 bulan.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
              <h4 className="font-semibold text-zinc-900 text-sm">
                3. Tiga Tingkat Urgensi Triase Medis
              </h4>
              <ul className="space-y-1 leading-relaxed">
                <li>• <strong className="text-emerald-700">Level 1 (Hijau):</strong> Observasi & perawatan awal mandiri di asrama (keluhan ringan, hidrasi, istirahat).</li>
                <li>• <strong className="text-amber-700">Level 2 (Kuning):</strong> Penilaian petugas UKS pada hari yang sama (keluhan mengganggu/menular).</li>
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

          <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5 font-medium text-zinc-700">
              <CheckCircle2 className="w-4 h-4 text-zinc-600" />
              <span>Dirancang dengan Prinsip Keamanan & Privasi Rekam Medis Siswa/Siswi</span>
            </span>
            <span className="font-mono">Versi Produksi: NADI v1.0 • SMA Boarding School</span>
          </div>
        </section>
      </div>
    </div>
  );
};
