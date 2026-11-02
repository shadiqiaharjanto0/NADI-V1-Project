import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  FileText,
  BookmarkPlus,
  Copy,
  Check,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Bot,
  Plus,
  MessageSquare,
  Clock,
  Trash2,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  School,
  GraduationCap,
} from 'lucide-react';
import { ChatMessage, StudentProfile, UKSReferralSlip, HealthRecord, AuthUser, ChatSession } from '../types';
import { parseHealthCheckResponse, StructuredHealthCheck } from '../utils/triageParser';
import { TriageBadge } from './TriageBadge';
import { FormattedText, MarkdownMessage } from './FormattedText';

interface ChatScreenProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onClearChat: () => void;
  studentProfile: StudentProfile;
  currentUser: AuthUser | null;
  onOpenUksSlip: (slip: UKSReferralSlip) => void;
  onSaveToDiary: (record: Omit<HealthRecord, 'id' | 'updates'>) => void;
  onTriggerEmergency: () => void;
  onNavigateToQuickTriage: () => void;
  sessions?: ChatSession[];
  activeSessionId?: string;
  onSelectSession?: (sessionId: string) => void;
  onCreateNewSession?: () => void;
  onDeleteSession?: (sessionId: string) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onClearChat,
  studentProfile,
  currentUser,
  onOpenUksSlip,
  onSaveToDiary,
  onTriggerEmergency,
  onNavigateToQuickTriage,
  sessions = [],
  activeSessionId,
  onSelectSession,
  onCreateNewSession,
  onDeleteSession,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedRecords, setSavedRecords] = useState<Record<string, boolean>>({});
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveCheckToDiary = (msgId: string, parsed: StructuredHealthCheck) => {
    onSaveToDiary({
      timestamp: new Date().toISOString(),
      complaintTitle: parsed.keluhanUtama || 'Pemeriksaan Kesehatan NADI',
      complaintDetails: parsed.penjelasan || 'Keluhan dilaporkan melalui skrining NADI AI.',
      severity: parsed.urgensi === 'MERAH' ? 9 : parsed.urgensi === 'KUNING' ? 6 : 3,
      duration: 'Baru terjadi / dalam pemantauan',
      triageLevel: parsed.urgensi,
      actionsTaken: parsed.tindakanSekarang.join('; '),
      status: parsed.urgensi === 'HIJAU' ? 'Aktif' : 'Dirujuk ke UKS',
    });
    setSavedRecords((prev) => ({ ...prev, [msgId]: true }));
  };

  const handleGenerateSlip = async (parsed: StructuredHealthCheck) => {
    const slipData: UKSReferralSlip = {
      ringkasanKeluhan: parsed.keluhanUtama,
      dugaanKategori: 'Keluhan Siswa Asrama',
      urgensi: parsed.urgensi,
      tindakanAwal: parsed.tindakanSekarang.join(', '),
      rekomendasiUntukUKS: parsed.tindakLanjut,
      tandaBahaya: parsed.tandaBahaya.join(', '),
      generatedAt: new Date().toISOString(),
      studentName: studentProfile.name,
      grade: studentProfile.grade,
      dormRoom: `${studentProfile.dormBuilding} • ${studentProfile.dormRoom}`,
    };
    onOpenUksSlip(slipData);
  };

  const quickPrompts = [
    {
      title: 'Demam & Meriang',
      text: 'Badan saya panas dan meriang sejak semalam di kamar asrama, kepala pusing dan lemas.',
      badge: 'Umum',
    },
    {
      title: 'Gatal Sela Jari (Skabies)',
      text: 'Sela-sela jari tangan saya gatal sekali dan ada bintik-bintik berair, saat malam hari gatal makin parah.',
      badge: 'Asrama',
    },
    {
      title: 'Sakit Perut & Maag',
      text: 'Perut saya perih melilit dan mual setelah tadi pagi terlambat sarapan di kantin asrama.',
      badge: 'Pencernaan',
    },
    {
      title: 'Pusing & Kliyengan',
      text: 'Pagi ini saya merasa pusing kliyengan dan mata berkunang-kunang setelah apel pagi di lapangan.',
      badge: 'Kelelahan',
    },
    {
      title: 'Batuk & Radang Tenggorokan',
      text: 'Tenggorokan saya sakit saat menelan dan batuk-batuk kering, teman sekamar juga ada yang flu.',
      badge: 'Menular',
    },
    {
      title: 'Keseleo / Cedera Engkel',
      text: 'Pergelangan kaki kanan saya terkilir saat tanding futsal di asrama tadi sore, terasa nyeri menumpu.',
      badge: 'Cedera',
    },
  ];

  // Group sessions by date
  const groupSessionsByDate = (list: ChatSession[]) => {
    const groups: { [label: string]: ChatSession[] } = {
      'Hari Ini': [],
      'Kemarin': [],
      'Minggu Ini': [],
      'Riwayat Sebelumnya': [],
    };

    const now = new Date();
    const todayStr = now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    list.forEach((s) => {
      const d = new Date(s.updatedAt || s.createdAt);
      if (d.toDateString() === todayStr) {
        groups['Hari Ini'].push(s);
      } else if (d.toDateString() === yesterdayStr) {
        groups['Kemarin'].push(s);
      } else if (d > oneWeekAgo) {
        groups['Minggu Ini'].push(s);
      } else {
        groups['Riwayat Sebelumnya'].push(s);
      }
    });

    return groups;
  };

  const groupedSessions = groupSessionsByDate(sessions);
  const currentRole = currentUser?.role || 'siswa';

  return (
    <div className="flex-1 flex bg-[#F8FAFC] text-slate-800 overflow-hidden no-print h-[calc(100vh-4rem)]">
      {/* SIDEBAR: History Chat Harian per Akun */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col ${
          isSidebarOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 tracking-tight">History Skrining</h2>
              <p className="text-[10px] text-slate-500 font-mono">Tersimpan Per Akun</p>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpenMobile(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Session Button */}
        <div className="p-3">
          <button
            onClick={() => {
              if (onCreateNewSession) onCreateNewSession();
              setIsSidebarOpenMobile(false);
            }}
            className="w-full py-2.5 px-3 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Sesi Skrining Baru</span>
          </button>
        </div>

        {/* Sessions List Grouped by Date */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {Object.entries(groupedSessions).map(([groupTitle, items]) => {
            if (items.length === 0) return null;
            return (
              <div key={groupTitle} className="space-y-1">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 px-2">
                  {groupTitle}
                </span>

                <div className="space-y-1">
                  {items.map((session) => {
                    const isActive = session.id === activeSessionId;
                    return (
                      <div
                        key={session.id}
                        className={`group relative rounded-lg transition-colors flex items-center justify-between text-xs ${
                          isActive
                            ? 'bg-teal-50 text-teal-900 font-medium border border-teal-200'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <button
                          onClick={() => {
                            if (onSelectSession) onSelectSession(session.id);
                            setIsSidebarOpenMobile(false);
                          }}
                          className="flex-1 text-left px-2.5 py-2 truncate flex items-center gap-2"
                        >
                          <MessageSquare
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isActive ? 'text-[#0D9488]' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{session.title || 'Sesi Skrining'}</span>
                        </button>

                        {onDeleteSession && items.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Hapus sesi skrining ini?')) {
                                onDeleteSession(session.id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 mr-1 text-slate-400 hover:text-red-600 rounded transition-opacity"
                            title="Hapus sesi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {sessions.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400 space-y-1">
              <Clock className="w-6 h-6 mx-auto text-slate-300" />
              <p>Belum ada riwayat sesi.</p>
            </div>
          )}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Riwayat privat terisolasi pada akun ini</span>
          </div>
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {isSidebarOpenMobile && (
        <div
          onClick={() => setIsSidebarOpenMobile(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-20 md:hidden"
        />
      )}

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Header Bar */}
        <div className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpenMobile(true)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              title="Buka History Chat"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs sm:text-sm text-slate-900">
                  Konsultasi & Skrining NADI
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 font-medium">
                  <Sparkles className="w-3 h-3 text-[#0D9488]" />
                  <span>Gemini 3.8 Flash • Search Grounding</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Evaluasi keluhan triase klinis & panduan keselamatan asrama sekolah
              </p>
            </div>
          </div>

          {/* Right Status: User Role Badge in Top Corner */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              {currentRole === 'siswa' ? (
                <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
              ) : currentRole === 'pembina' ? (
                <School className="w-3.5 h-3.5 text-teal-600" />
              ) : (
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              )}
              <span className="font-bold text-slate-900 capitalize text-[11px]">
                {currentRole === 'siswa' ? 'Siswa' : currentRole === 'pembina' ? 'Pembina' : 'Nakes UKS'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 text-[11px] font-medium truncate max-w-[120px]">
                {currentUser?.name ? currentUser.name.split(' ')[0] : studentProfile.name.split(' ')[0]}
              </span>
            </div>

            <button
              onClick={onClearChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Bersihkan sesi chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
          {/* Quick Prompts on New Chat */}
          {messages.length <= 1 && (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Pilih Contoh Keluhan Cepat Siswa Asrama:
                </span>
                <button
                  onClick={onNavigateToQuickTriage}
                  className="text-xs font-semibold text-[#0D9488] hover:underline inline-flex items-center gap-1"
                >
                  <span>Formulir Terpandu</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {quickPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(item.text)}
                    className="p-3.5 rounded-lg bg-slate-50/70 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 text-left transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-[#0D9488] transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      &quot;{item.text}&quot;
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="max-w-3xl mx-auto space-y-5">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              const parsedCheck = !isUser ? parseHealthCheckResponse(message.text) : null;
              const isEmergency = message.triageLevel === 'MERAH' || parsedCheck?.urgensi === 'MERAH';

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  {/* Message Bubble:
                      User: Soft Mint Green / Medical Teal
                      AI: Crisp Clean White Card with Subtle Grey Border
                  */}
                  <div
                    className={`max-w-[90%] sm:max-w-[82%] rounded-xl ${
                      isUser
                        ? 'bg-[#E6F8F5] text-[#115E59] border border-[#99F6E4] p-4 shadow-2xs'
                        : isEmergency
                        ? 'bg-red-50/70 border border-red-200 text-slate-800 p-5 shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-800 p-5 shadow-xs'
                    }`}
                  >
                    {/* User Message Content */}
                    {isUser && (
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-medium">
                          {message.text}
                        </p>
                        <div className="flex items-center justify-end text-[10px] text-teal-700/70 font-mono tabular-nums pt-1">
                          {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    )}

                    {/* AI Message Content */}
                    {!isUser && (
                      <div className="space-y-4 text-xs">
                        {parsedCheck ? (
                          <div className="space-y-4">
                            {/* Card Header with Triage Urgency */}
                            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                              <div>
                                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                                  Evaluasi Triase Medis NADI
                                </span>
                                <h3 className="font-bold text-sm text-slate-900 tracking-tight">
                                  Hasil Skrining Klinis
                                </h3>
                              </div>
                              <TriageBadge level={parsedCheck.urgensi} size="sm" />
                            </div>

                            {/* Emergency red banner if level 3 */}
                            {parsedCheck.urgensi === 'MERAH' && (
                              <div className="p-3.5 rounded-lg bg-red-600 text-white flex items-center justify-between gap-3 text-xs shadow-xs">
                                <div className="flex items-center gap-2">
                                  <ShieldAlert className="w-5 h-5 shrink-0" />
                                  <span className="font-bold">
                                    Kondisi Kegawatdaruratan! Segera panggil pembina atau hubungi 119/112.
                                  </span>
                                </div>
                                <button
                                  onClick={onTriggerEmergency}
                                  className="px-3 py-1.5 bg-white text-red-700 font-bold rounded-md hover:bg-red-50 shrink-0 text-xs shadow-2xs"
                                >
                                  Panggilan SOS
                                </button>
                              </div>
                            )}

                            {/* Keluhan Utama */}
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-0.5">
                                Keluhan Utama:
                              </span>
                              <p className="text-xs sm:text-sm font-bold text-slate-900">
                                <FormattedText text={parsedCheck.keluhanUtama} />
                              </p>
                            </div>

                            {/* Penjelasan Singkat */}
                            {parsedCheck.penjelasan && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                                  Analisis & Deduksi Klinis:
                                </span>
                                <p className="text-slate-700 leading-relaxed">
                                  <FormattedText text={parsedCheck.penjelasan} />
                                </p>
                              </div>
                            )}

                            {/* Tindakan Pertolongan Pertama di Asrama */}
                            <div className="bg-teal-50/40 p-4 rounded-lg border border-teal-200/80 space-y-2">
                              <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                                Tindakan Pertolongan Pertama di Asrama:
                              </span>
                              <ul className="text-slate-700 space-y-2 list-none pl-0 leading-relaxed">
                                {parsedCheck.tindakanSekarang.map((action, i) => (
                                  <li key={i} className="flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                      {i + 1}
                                    </span>
                                    <div className="flex-1">
                                      <FormattedText text={action} />
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Tanda Bahaya Red Flags */}
                            {parsedCheck.tandaBahaya.length > 0 && (
                              <div className="p-3.5 rounded-lg border border-amber-300 bg-amber-50/70 text-amber-950 space-y-1.5">
                                <span className="text-xs font-bold uppercase flex items-center gap-1.5 text-amber-900">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span>Tanda Bahaya yang Perlu Diwaspadai:</span>
                                </span>
                                <ul className="space-y-1 list-disc pl-5 text-amber-900 text-xs">
                                  {parsedCheck.tandaBahaya.map((item, i) => (
                                    <li key={i}>
                                      <FormattedText text={item} />
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Tindak Lanjut & Rekomendasi UKS */}
                            {parsedCheck.tindakLanjut && (
                              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800">
                                <span className="font-semibold block mb-0.5 text-[10px] uppercase font-mono text-slate-400">
                                  Tindak Lanjut & Rekomendasi UKS:
                                </span>
                                <p className="leading-relaxed">
                                  <FormattedText text={parsedCheck.tindakLanjut} />
                                </p>
                              </div>
                            )}

                            {/* Action Buttons: Cross-Rekap Sync & Slip PDF */}
                            <div className="pt-3 flex flex-wrap items-center gap-2 border-t border-slate-100">
                              <button
                                onClick={() => handleGenerateSlip(parsedCheck)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold shadow-xs transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Cetak Rujukan UKS</span>
                              </button>

                              <button
                                onClick={() => handleSaveCheckToDiary(message.id, parsedCheck)}
                                disabled={savedRecords[message.id]}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                                  savedRecords[message.id]
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
                                }`}
                              >
                                <BookmarkPlus className="w-3.5 h-3.5" />
                                <span>
                                  {savedRecords[message.id] ? 'Terekap di Semua Dasbor' : 'Simpan ke Rekap Medis'}
                                </span>
                              </button>

                              <button
                                onClick={() => handleCopyText(message.id, message.text)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs font-medium ml-auto transition-colors"
                                title="Salin Jawaban"
                              >
                                {copiedId === message.id ? (
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
                        ) : (
                          /* Standard Conversational Markdown Message */
                          <div className="space-y-2">
                            <MarkdownMessage content={message.text} />
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100">
                              <span>
                                {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <button
                                onClick={() => handleCopyText(message.id, message.text)}
                                className="hover:text-slate-700 transition-colors"
                              >
                                {copiedId === message.id ? 'Tersalin' : 'Salin'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-2.5 text-xs text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-ping" />
                  <span>NADI sedang menganalisis gejala dengan data medis terkini...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar Section */}
        <div className="border-t border-slate-200 bg-white p-3 sm:p-4 shrink-0">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-end gap-2.5">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tuliskan keluhan kesehatan atau gejala yang kamu rasakan di asrama..."
                disabled={isLoading}
                className="w-full pl-3.5 pr-3 py-2.5 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 text-xs focus:outline-hidden focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] bg-[#F8FAFC] resize-none min-h-[42px] max-h-32 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2.5 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-40 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0 min-h-[42px]"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="max-w-3xl mx-auto flex items-center justify-between text-[10px] text-slate-400 pt-1.5 px-1 font-mono">
            <span>Tekan Enter untuk kirim • Shift + Enter untuk baris baru</span>
            <span>Bukan pengganti diagnosis dokter IGD</span>
          </div>
        </div>
      </div>
    </div>
  );
};
