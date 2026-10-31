import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  User,
  HeartPulse,
  RotateCcw,
  FileText,
  BookmarkPlus,
  Copy,
  Check,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Bot,
} from 'lucide-react';
import { ChatMessage, StudentProfile, UKSReferralSlip, HealthRecord } from '../types';
import { parseHealthCheckResponse, StructuredHealthCheck } from '../utils/triageParser';
import { TriageBadge } from './TriageBadge';
import { FormattedText, MarkdownMessage } from './FormattedText';

interface ChatScreenProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onClearChat: () => void;
  studentProfile: StudentProfile;
  onOpenUksSlip: (slip: UKSReferralSlip) => void;
  onSaveToDiary: (record: Omit<HealthRecord, 'id' | 'updates'>) => void;
  onTriggerEmergency: () => void;
  onNavigateToQuickTriage: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onClearChat,
  studentProfile,
  onOpenUksSlip,
  onSaveToDiary,
  onTriggerEmergency,
  onNavigateToQuickTriage,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedRecords, setSavedRecords] = useState<Record<string, boolean>>({});
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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full px-3 sm:px-6 py-4 no-print">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 sm:px-2 pb-4">
        {/* Quick Prompts when 1 or few messages */}
        {messages.length <= 1 && (
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-4 my-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                Pilih Contoh Keluhan Siswa Asrama:
              </span>
              <button
                onClick={onNavigateToQuickTriage}
                className="text-xs font-medium text-[#0071E3] hover:underline inline-flex items-center gap-1"
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
                  className="p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-zinc-900 group-hover:text-[#0071E3] transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-zinc-500">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 line-clamp-2 leading-relaxed">
                    &quot;{item.text}&quot;
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
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
                <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl ${
                  isUser
                    ? 'bg-[#0071E3] text-white p-3.5 sm:p-4 shadow-xs'
                    : isEmergency
                    ? 'bg-red-50 border border-red-200 text-zinc-900 p-4 sm:p-5 shadow-xs'
                    : 'bg-white border border-zinc-200 text-zinc-900 p-4 sm:p-5 shadow-xs'
                }`}
              >
                {/* User Message */}
                {isUser && (
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                      {message.text}
                    </p>
                    <div className="flex items-center justify-end text-[10px] text-blue-100 font-mono tabular-nums pt-1">
                      {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}

                {/* Model Message */}
                {!isUser && (
                  <div className="space-y-3.5 text-xs">
                    {parsedCheck ? (
                      <div className="space-y-3.5">
                        {/* Header Box */}
                        <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-zinc-200">
                          <span className="font-semibold text-xs sm:text-sm text-zinc-900 tracking-tight">
                            Hasil Skrining Klinis NADI
                          </span>
                          <TriageBadge level={parsedCheck.urgensi} size="sm" />
                        </div>

                        {/* Emergency banner if MERAH */}
                        {parsedCheck.urgensi === 'MERAH' && (
                          <div className="p-3 rounded-xl bg-red-600 text-white flex items-center justify-between gap-3 text-xs shadow-xs">
                            <div className="flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4 shrink-0" />
                              <span className="font-semibold">
                                Kondisi gawat darurat! Segera hubungi pembina asrama atau tekan tombol SOS.
                              </span>
                            </div>
                            <button
                              onClick={onTriggerEmergency}
                              className="px-2.5 py-1 bg-white text-red-700 font-bold rounded-md hover:bg-red-50 shrink-0 text-xs"
                            >
                              Buka Hotline
                            </button>
                          </div>
                        )}

                        {/* Keluhan Utama */}
                        <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                          <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">
                            Keluhan Utama:
                          </span>
                          <p className="text-xs sm:text-sm font-semibold text-zinc-900">
                            <FormattedText text={parsedCheck.keluhanUtama} />
                          </p>
                        </div>

                        {/* Penjelasan Singkat */}
                        {parsedCheck.penjelasan && (
                          <div>
                            <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                              Analisis Singkat:
                            </span>
                            <p className="text-zinc-700 leading-relaxed">
                              <FormattedText text={parsedCheck.penjelasan} />
                            </p>
                          </div>
                        )}

                        {/* Yang Perlu Dilakukan Sekarang */}
                        <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 space-y-1.5">
                          <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider block">
                            Tindakan Pertolongan Pertama di Asrama:
                          </span>
                          <ul className="text-zinc-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                            {parsedCheck.tindakanSekarang.map((action, i) => (
                              <li key={i}>
                                <FormattedText text={action} />
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tanda Bahaya */}
                        {parsedCheck.tandaBahaya.length > 0 && (
                          <div className="p-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-950 space-y-1">
                            <span className="text-xs font-semibold uppercase flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                              <span>Tanda Bahaya Red Flags:</span>
                            </span>
                            <ul className="space-y-1 list-disc pl-4 text-amber-900">
                              {parsedCheck.tandaBahaya.map((item, i) => (
                                <li key={i}>
                                  <FormattedText text={item} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Tindak Lanjut */}
                        {parsedCheck.tindakLanjut && (
                          <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 text-zinc-800">
                            <span className="font-semibold block mb-0.5 text-[10px] uppercase font-mono text-zinc-500">
                              Tindak Lanjut & Rekomendasi UKS:
                            </span>
                            <p className="leading-relaxed">
                              <FormattedText text={parsedCheck.tindakLanjut} />
                            </p>
                          </div>
                        )}

                        {/* Action buttons inside Health Check */}
                        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-zinc-200">
                          <button
                            onClick={() => handleGenerateSlip(parsedCheck)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0071E3] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Cetak Rujukan UKS</span>
                          </button>

                          <button
                            onClick={() => handleSaveCheckToDiary(message.id, parsedCheck)}
                            disabled={savedRecords[message.id]}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              savedRecords[message.id]
                                ? 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-300'
                            }`}
                          >
                            <BookmarkPlus className="w-3.5 h-3.5" />
                            <span>
                              {savedRecords[message.id] ? 'Tersimpan di Rekap' : 'Simpan ke Rekap Siswa'}
                            </span>
                          </button>

                          <button
                            onClick={() => handleCopyText(message.id, message.text)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 text-xs font-medium ml-auto transition-colors"
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
                      /* Regular Conversational Message */
                      <div className="space-y-2">
                        <MarkdownMessage content={message.text} />
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pt-1 border-t border-zinc-100">
                          <span>NADI Health Intelligence</span>
                          <button
                            onClick={() => handleCopyText(message.id, message.text)}
                            className="hover:text-zinc-700"
                          >
                            {copiedId === message.id ? 'Tersalin' : 'Salin'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-zinc-200 text-zinc-800 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-2.5 items-center text-zinc-600 text-xs p-3 bg-white rounded-xl border border-zinc-200 max-w-sm">
            <HeartPulse className="w-4 h-4 text-[#0071E3] animate-pulse" />
            <span>NADI sedang menganalisis gejala klinis...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-2 bg-white rounded-2xl border border-zinc-200 shadow-sm p-3 space-y-2">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik keluhan kesehatan yang kamu rasakan di asrama..."
            className="flex-1 bg-transparent border-0 focus:ring-0 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 resize-none max-h-24 overflow-y-auto outline-hidden"
          />

          <div className="flex items-center gap-1.5 shrink-0">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={onClearChat}
                title="Mulai Percakapan Baru"
                className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`p-2.5 rounded-lg text-xs transition-colors flex items-center justify-center ${
                inputText.trim() && !isLoading
                  ? 'bg-[#0071E3] hover:bg-blue-600 text-white'
                  : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-1 border-t border-zinc-100 px-1">
          <span className="truncate">
            Siswa: <strong>{studentProfile.name.split(' ')[0]}</strong> ({studentProfile.dormRoom})
          </span>
          <span className="hidden sm:inline">Tekan Enter untuk kirim</span>
        </div>
      </div>
    </div>
  );
};
