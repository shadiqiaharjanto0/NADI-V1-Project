import React from 'react';
import {
  Activity,
  MessageSquare,
  ClipboardList,
  BookOpen,
  ShieldAlert,
  FileHeart,
  School,
  Stethoscope,
  GraduationCap,
  LogOut,
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      {/* Top Status Ticker - Clinical Minimalist */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            <span className="font-semibold text-white tracking-tight">NADI Health Intelligence</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline text-[11px]">
              Sistem Skrining Medis & Pengawasan Asrama Boarding School
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px] hidden md:inline">
                  Akun:
                </span>
                <span className="text-slate-200 font-medium text-[11px] truncate max-w-[160px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-slate-800 text-teal-300 border border-slate-700">
                  {getRoleLabel()}
                </span>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors ml-1"
                  title="Keluar dari akun saat ini"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="text-[11px] text-[#0D9488] hover:underline font-semibold"
              >
                Masuk Akun
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo - Headline NADI acts as Home (Beranda) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2.5 text-left group p-1 -ml-1 rounded-lg hover:bg-slate-100 transition-colors"
              title="Kembali ke Beranda"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0D9488] text-white flex items-center justify-center font-bold text-sm tracking-tighter shadow-2xs group-hover:bg-[#0F766E] transition-colors">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-slate-900">
                    NADI
                  </span>
                  <span className="text-[10px] font-mono text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                    v1.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal">
                  Clinical Intelligence Portal
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation - Simplified, Clinical Minimalist */}
          <nav className="hidden md:flex items-center gap-1.5">
            {/* SISWA ONLY NAVIGATION */}
            {role === 'siswa' && (
              <>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-[#0D9488] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Skrining NADI</span>
                </button>

                <button
                  onClick={() => setActiveTab('quick-triage')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'quick-triage'
                      ? 'bg-[#0D9488] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileHeart className="w-3.5 h-3.5" />
                  <span>Skrining Cepat</span>
                </button>

                <button
                  onClick={() => setActiveTab('diary')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors relative ${
                    activeTab === 'diary'
                      ? 'bg-[#0D9488] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Buku Rekap Siswa</span>
                  {hasActiveRecordsCount > 0 && (
                    <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center tabular-nums ${
                      activeTab === 'diary' ? 'bg-white text-teal-800' : 'bg-teal-100 text-teal-800'
                    }`}>
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'dorm-monitor'
                      ? 'bg-[#0D9488] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <School className="w-3.5 h-3.5" />
                  <span>Monitoring Asrama</span>
                  {hasActiveRecordsCount > 0 && (
                    <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center tabular-nums ${
                      activeTab === 'dorm-monitor' ? 'bg-white text-teal-800' : 'bg-teal-100 text-teal-800'
                    }`}>
                      {hasActiveRecordsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-[#0D9488] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'clinic-queue'
                      ? 'bg-[#0D9488] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Antrean & Rekam Medis UKS</span>
                  {hasActiveRecordsCount > 0 && (
                    <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center tabular-nums ${
                      activeTab === 'clinic-queue' ? 'bg-white text-teal-800' : 'bg-teal-100 text-teal-800'
                    }`}>
                      {hasActiveRecordsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-[#0D9488] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Konsultasi Medis</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'education'
                  ? 'bg-[#0D9488] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-left transition-colors"
                title="Buka Profil Pribadi"
              >
                <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-teal-700">
                  {role === 'siswa' ? (
                    <GraduationCap className="w-3.5 h-3.5" />
                  ) : role === 'pembina' ? (
                    <School className="w-3.5 h-3.5" />
                  ) : (
                    <Stethoscope className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="hidden sm:block leading-none">
                  <p className="text-xs font-semibold text-slate-900 max-w-[120px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {role === 'siswa' ? studentProfile.dormRoom || 'Siswa' : getRoleLabel()}
                  </p>
                </div>
              </button>
            ) : null}

            {/* Emergency SOS Button */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Darurat 119 / 112</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-between border-t border-slate-100 py-2 text-xs overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 text-xs font-medium ${
              activeTab === 'landing' ? 'bg-[#0D9488] text-white font-semibold' : 'text-slate-600'
            }`}
          >
            <span>Beranda</span>
          </button>

          {role === 'siswa' && (
            <>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 text-xs font-medium ${
                  activeTab === 'chat' ? 'bg-[#0D9488] text-white font-semibold' : 'text-slate-600'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>Skrining</span>
              </button>
              <button
                onClick={() => setActiveTab('quick-triage')}
                className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 text-xs font-medium ${
                  activeTab === 'quick-triage' ? 'bg-[#0D9488] text-white font-semibold' : 'text-slate-600'
                }`}
              >
                <FileHeart className="w-3 h-3" />
                <span>Gejala</span>
              </button>
              <button
                onClick={() => setActiveTab('diary')}
                className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 text-xs font-medium ${
                  activeTab === 'diary' ? 'bg-[#0D9488] text-white font-semibold' : 'text-slate-600'
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
              className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 text-xs font-medium ${
                activeTab === 'dorm-monitor' ? 'bg-[#0D9488] text-white font-semibold' : 'text-slate-600'
              }`}
            >
              <School className="w-3 h-3" />
              <span>Monitoring Asrama</span>
            </button>
          )}

          {role === 'nakes' && (
            <button
              onClick={() => setActiveTab('clinic-queue')}
              className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 text-xs font-medium ${
                activeTab === 'clinic-queue' ? 'bg-[#0D9488] text-white font-semibold' : 'text-slate-600'
              }`}
            >
              <Stethoscope className="w-3 h-3" />
              <span>Klinik UKS</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('education')}
            className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 text-xs font-medium ${
              activeTab === 'education' ? 'bg-[#0D9488] text-white font-semibold' : 'text-slate-600'
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
