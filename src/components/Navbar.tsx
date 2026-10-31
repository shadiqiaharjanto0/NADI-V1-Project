import React from 'react';
import {
  Activity,
  MessageSquare,
  ClipboardList,
  BookOpen,
  User,
  ShieldAlert,
  FileHeart,
  School,
  Stethoscope,
  GraduationCap,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { StudentProfile, AuthUser } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  studentProfile: StudentProfile;
  currentUser: AuthUser | null;
  onOpenProfile: () => void;
  onOpenEmergency: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  hasActiveRecordsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  studentProfile,
  currentUser,
  onOpenProfile,
  onOpenEmergency,
  onOpenLogin,
  onLogout,
  hasActiveRecordsCount = 0,
}) => {
  const role = currentUser?.role || 'siswa';

  const getRoleLabel = () => {
    if (role === 'siswa') return 'Siswa / Siswi';
    if (role === 'pembina') return 'Pembina Asrama';
    return 'Tenaga Medis UKS';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 no-print">
      {/* Top Status Ticker - Apple Minimalist */}
      <div className="bg-zinc-900 text-zinc-300 text-xs px-4 py-1.5 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-white tracking-tight">NADI Health Intelligence</span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-zinc-400 hidden sm:inline text-[11px]">
              Sistem Skrining Medis & Pengawasan Asrama Boarding School
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 text-[11px] hidden md:inline">
                  Akun:
                </span>
                <span className="text-zinc-200 font-medium text-[11px] truncate max-w-[160px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {getRoleLabel()}
                </span>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors ml-1"
                  title="Keluar dari akun saat ini"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="text-[11px] text-[#0071E3] hover:underline font-medium"
              >
                Masuk Akun
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!currentUser) setActiveTab('landing');
                else if (role === 'pembina') setActiveTab('dorm-monitor');
                else if (role === 'nakes') setActiveTab('clinic-queue');
                else setActiveTab('chat');
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm tracking-tighter">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-base tracking-tight text-zinc-900">
                    NADI
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">
                    v1.0
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 font-normal">
                  School Health Portal
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation - Strictly Role-Scoped (RBAC) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'landing'
                  ? 'bg-zinc-100 text-zinc-900 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Portal Beranda</span>
            </button>

            {/* SISWA ONLY NAVIGATION */}
            {role === 'siswa' && (
              <>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Skrining NADI</span>
                </button>

                <button
                  onClick={() => setActiveTab('quick-triage')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'quick-triage'
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  <FileHeart className="w-3.5 h-3.5" />
                  <span>Skrining Cepat</span>
                </button>

                <button
                  onClick={() => setActiveTab('diary')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors relative ${
                    activeTab === 'diary'
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Buku Rekap Siswa</span>
                  {hasActiveRecordsCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-zinc-800 text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                      {hasActiveRecordsCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* PEMBINA ONLY NAVIGATION */}
            {role === 'pembina' && (
              <>
                <button
                  onClick={() => setActiveTab('dorm-monitor')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'dorm-monitor'
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  <School className="w-3.5 h-3.5" />
                  <span>Monitoring Asrama</span>
                  {hasActiveRecordsCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-zinc-800 text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                      {hasActiveRecordsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Konsultasi SOP</span>
                </button>
              </>
            )}

            {/* NAKES ONLY NAVIGATION */}
            {role === 'nakes' && (
              <>
                <button
                  onClick={() => setActiveTab('clinic-queue')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'clinic-queue'
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Antrean & Rekam Medis UKS</span>
                  {hasActiveRecordsCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-zinc-800 text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                      {hasActiveRecordsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Konsultasi Medis</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'education'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Edukasi Asrama</span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* User Profile Pill */}
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-left transition-colors"
                title="Buka Profil Pribadi"
              >
                <div className="w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-700">
                  {role === 'siswa' ? (
                    <GraduationCap className="w-3.5 h-3.5" />
                  ) : role === 'pembina' ? (
                    <School className="w-3.5 h-3.5" />
                  ) : (
                    <Stethoscope className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="hidden sm:block leading-none">
                  <p className="text-xs font-semibold text-zinc-900 max-w-[120px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {role === 'siswa' ? studentProfile.dormRoom || 'Siswa' : getRoleLabel()}
                  </p>
                </div>
              </button>
            ) : null}

            {/* Emergency SOS Button */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Darurat 119 / 112</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-between border-t border-zinc-100 py-2 text-xs overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 ${
              activeTab === 'landing' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-600'
            }`}
          >
            <LayoutDashboard className="w-3 h-3" />
            <span>Beranda</span>
          </button>

          {role === 'siswa' && (
            <>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 ${
                  activeTab === 'chat' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-600'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>Skrining</span>
              </button>
              <button
                onClick={() => setActiveTab('quick-triage')}
                className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 ${
                  activeTab === 'quick-triage' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-600'
                }`}
              >
                <FileHeart className="w-3 h-3" />
                <span>Gejala</span>
              </button>
              <button
                onClick={() => setActiveTab('diary')}
                className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 ${
                  activeTab === 'diary' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-600'
                }`}
              >
                <ClipboardList className="w-3 h-3" />
                <span>Rekap Siswa</span>
              </button>
            </>
          )}

          {role === 'pembina' && (
            <button
              onClick={() => setActiveTab('dorm-monitor')}
              className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 ${
                activeTab === 'dorm-monitor' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-600'
              }`}
            >
              <School className="w-3 h-3" />
              <span>Monitoring Asrama</span>
            </button>
          )}

          {role === 'nakes' && (
            <button
              onClick={() => setActiveTab('clinic-queue')}
              className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 ${
                activeTab === 'clinic-queue' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-600'
              }`}
            >
              <Stethoscope className="w-3 h-3" />
              <span>Klinik UKS</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('education')}
            className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 ${
              activeTab === 'education' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-600'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Edukasi</span>
          </button>
        </div>
      </div>
    </header>
  );
};
